import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProductDto,
  SearchProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dto';
import { IProducts, IProduct } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { SCHEMA } from '../../common/mock';
import { FilesService } from '../../files/services';
import { MediaDto } from '../../common/dto';
import {
  createSearchQuery,
  subDocUpdateWithArray,
  createSelectQuery,
  getMimeTypeFromUrl,
  updateMongoDBDocuments,
  slug,
} from '../../common/utils/helper';
import { IMedia } from '../../common/interfaces';

@Injectable()
export class ProductsService {
  /**
   * Constructor
   * @param {Model<IProduct>} model
   * @param {service<FilesService>} filesService
   */
  constructor(
    @InjectModel(SCHEMA.PRODUCT)
    private readonly model: Model<IProduct>,
    private readonly filesService: FilesService,
  ) {}

  private async uploadFile(files?: {
    images?: Express.Multer.File[];
    videos?: Express.Multer.File[];
  }): Promise<any> {
    let images, videos;
    if (files) {
      if (files && files.images) {
        images = await Promise.all(
          files.images.map(async (image) => {
            const { mimetype } = image;
            const uploadRes = await this.filesService.upload(image);
            const mediaDTO = new MediaDto();
            mediaDTO.uri = uploadRes.Location;
            mediaDTO.provider = uploadRes.provider;
            mediaDTO.mimetype = mimetype;
            return mediaDTO;
          }),
        );
      }
      if (files && files.videos) {
        videos = await Promise.all(
          files.videos.map(async (video) => {
            const { mimetype } = video;
            const uploadRes = await this.filesService.upload(video);
            const mediaDTO = new MediaDto();
            mediaDTO.uri = uploadRes.Location;
            mediaDTO.provider = uploadRes.provider;
            mediaDTO.mimetype = mimetype;
            return mediaDTO;
          }),
        );
      }
    }
    return {
      images,
      videos,
    };
  }

  /**
   * Create product
   * @param {IUser} user
   * @param {CreateProductDto} data
   * @returns {Promise<IProduct>}
   */
  async create(
    data: CreateProductDto,
    user: IUser,
    files?: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ): Promise<IProduct> {
    try {
      let uploadedFiles;
      
      if (Object.keys(files).length > 0)
        uploadedFiles = await this.uploadFile(files);

      const body = new ProductDto({
        ...data,
        images: uploadedFiles?.images ?? undefined,
        videos: uploadedFiles?.videos ?? undefined,
        seller: user._id,
        slug: slug(),
        cBy: user._id,
      });
      const registerDoc = new this.model(body);

      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Update product
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateProductDto} data
   * @returns {Promise<IProduct>}
   */
  async update(
    id: string,
    data: UpdateProductDto,
    user: IUser,
    files?: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ): Promise<IProduct> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(new NotFoundException('Could not find product.'));
      }
      const body = new ProductDto({
        ...data,
        uBy: user._id,
      });
      if (files) {
        if (files && files.images) {
          const images = await Promise.all(
            files.images.map(async (image) => {
              const { mimetype } = image;
              const uploadRes = await this.filesService.upload(image);
              const mediaDTO = new MediaDto();
              mediaDTO.uri = uploadRes.Location;
              mediaDTO.provider = uploadRes.provider;
              mediaDTO.mimetype = mimetype;
              return mediaDTO;
            }),
          );

          const docs = record.get('images') || [];
          body.images = subDocUpdateWithArray(docs, images);
        }
        if (files && files.videos) {
          const videos = await Promise.all(
            files.videos.map(async (video) => {
              const { mimetype } = video;
              const uploadRes = await this.filesService.upload(video);
              const mediaDTO = new MediaDto();
              mediaDTO.uri = uploadRes.Location;
              mediaDTO.provider = uploadRes.provider;
              mediaDTO.mimetype = mimetype;
              return mediaDTO;
            }),
          );

          const docs = record.get('videos') || [];
          body.videos = subDocUpdateWithArray(docs, videos);
        }
      }

      if (data && typeof data === 'object' && 'images' in data) {
        const docs = record.get('images') || [];
        body.images = updateMongoDBDocuments(docs, data.images) as [IMedia];
      }
      if (data && typeof data === 'object' && 'videos' in data) {
        const docs = record.get('videos') || [];
        body.videos = subDocUpdateWithArray(docs, data.videos);
      }

      return (await record.set(body).save()).populate([
        'category',
        'subCategory',
      ]);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All products
   * @param {SearchProductDto} query
   * @returns {Promise<IProducts>}
   */
  async findAll(query: SearchProductDto): Promise<IProducts> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);

      const populations = [
        'owner',
        'category',
        'subCategory',
      ];
      if (query && query.select) {
        const { select, populationPathMap } = createSelectQuery(
          query,
          populations,
        );
        cursor.select(select);
        Object.keys(populationPathMap).forEach((key) => {
          if (Object.keys(populationPathMap[key]['select']).length > 0)
            cursor.populate(populationPathMap[key]);
        });
      } else {
        populations.map((item) => {
          cursor.populate(item);
        });
      }

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      } else {
        cursor.sort({ $natural: 1 });
      }

      let data: IProduct[] = await cursor.exec();

      if (query.user) {
        data.forEach((doc) => {
          doc['_doc'].currentUser = query.user._id;
        });
      }

      const result: IProducts = {
        data,
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.count(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find one product
   * @param {string} id
   * @returns {Promise<IProduct>}
   */
  async findOne(id: string): Promise<IProduct> {
    try {
      const res = await this.model.findOne({ _id: id });

      if (!res) {
        return Promise.reject(new NotFoundException('Could not find product.'));
      }
      return res;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count products
   * @returns {Promise<number>}
   */
  async count(query: SearchProductDto): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return this.model.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
