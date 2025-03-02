import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCategoryDto,
  SearchCategoryDto,
  CategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { ICategories, ICategory } from '../interfaces';
import { IUser } from '../../users/interfaces';
import { SCHEMA } from '../../common/mock';
import { FilesService } from '../../files/services';
import { MediaDto } from '../../common/dto';
import {
  createSearchQuery,
  subDocUpdateWithObj,
} from '../../common/utils/helper';

@Injectable()
export class CategoriesService {
  /**
   * Constructor
   * @param {Model<ICategory>} model
   * @param {service<FilesService>} filesService
   */
  constructor(
    @InjectModel(SCHEMA.CATEGORY)
    private readonly model: Model<ICategory>,
    private readonly filesService: FilesService,
  ) {}

  private async uploadFile(files: {
    image: Express.Multer.File[];
  }): Promise<any> {
    const { mimetype } = files.image[0];
    const uploadRes = await this.filesService.upload(files.image[0]);
    const mediaDTO = new MediaDto();
    mediaDTO.uri = uploadRes.Location;
    mediaDTO.provider = uploadRes.provider;
    mediaDTO.mimetype = mimetype;
    return mediaDTO;
  }

  /**
   * Create category
   * @param {IUser} user
   * @param {CreateCategoryDto} data
   * @returns {Promise<ICategory>}
   */
  async create(
    data: CreateCategoryDto,
    user: IUser,
    files?: {
      image: Express.Multer.File[];
    },
  ): Promise<ICategory> {
    try {
      const newObj = {
        ...data,
        cBy: user._id,
      };
      if (files) {
        if (files?.image) {
          const uploadedFiles = await this.uploadFile(files);
          newObj.image = uploadedFiles ?? undefined;
        }
      }
      const body = new CategoryDto(newObj);
      const registerDoc = new this.model(body);
      return await registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Update category
   * @param {IUser} user
   * @param {string} id
   * @param {UpdateCategoryDto} data
   * @returns {Promise<ICategory>}
   */
  async update(
    id: string,
    data: UpdateCategoryDto,
    user: IUser,
    files?: {
      image: Express.Multer.File[];
    },
  ): Promise<ICategory> {
    try {
      const record = await this.model.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!record) {
        return Promise.reject(
          new NotFoundException('Could not find category.'),
        );
      }
      const body = new CategoryDto({
        ...data,
        uBy: user._id,
      });
      if (files) {
        if (files && files.image) {
          const mediaDTO = await this.uploadFile(files);
          const doc = record.get('image') || {};
          body.image = subDocUpdateWithObj(doc, mediaDTO);
        }
      }
      return await record.set(body).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Find All category
   * @param {SearchCategoryDto} query
   * @returns {Promise<ICategories>}
   */
  async findAll(query: SearchCategoryDto): Promise<ICategories> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = !query.getAllRecord
        ? this.model.find(searchQuery).limit(limit).skip(skip)
        : this.model.find(searchQuery);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: ICategories = {
        data: await cursor.exec(),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.model.countDocuments(searchQuery),
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
   * Find one category
   * @param {string} id
   * @returns {Promise<ICategory>}
   */
  async findOne(id: string): Promise<ICategory> {
    try {
      const res = await this.model.findOne({ _id: id });

      if (!res) {
        return Promise.reject(
          new NotFoundException('Could not find category.'),
        );
      }
      return res;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * count category
   * @returns {Promise<number>}
   */
  async count(query: SearchCategoryDto): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return await this.model.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
