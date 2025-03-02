import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AwsS3Service, LocalStorageService } from '../services';
import { ProviderDTO } from '../dto/provider.dto';
import { MediaProvider } from '../../common/mock/constant.mock';
import { DOSpaceService } from './do-space.service';
import { getMimeTypeFromUrl } from '../../common/utils/helper';
import { MediaDto } from '../../common/dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  /**
   * Constructor
   * @param {service<DOSpaceService>} doSpacesService
   * @param {service<AwsS3Service>} awsS3Service
   * @param {service<LocalStorageService>} localStorageService
   */
  constructor(
    private readonly doSpacesService: DOSpaceService,
    private readonly awsS3Service: AwsS3Service,
    private readonly localStorageService: LocalStorageService,
  ) {}

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @param {ProviderDTO} providerDto
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File, providerDto?: ProviderDTO) {
    const PROVIDER = providerDto?.provider || process.env.FILE_SPACE_PROVIDER;
    this.logger.log(PROVIDER + ' Provider');
    const AWS_BUCKET_FOLDER = process.env.AWS_S3_BUCKET_FOLDER;
    const response = {
      Location: '',
      provider: PROVIDER,
    };

    switch (PROVIDER) {
      case MediaProvider.DO_SPACE:
        const doLocation = await this.doSpacesService.uploadToDOSpace(
          file,
          AWS_BUCKET_FOLDER,
        );
        response.Location = doLocation.Location;
        return response;
      case MediaProvider.AWS_S3:
        const awsLocation = await this.awsS3Service.uploadToS3(
          file,
          AWS_BUCKET_FOLDER,
        );
        response.Location = awsLocation.Location;
        return response;
      case MediaProvider.LOCAL:
        const publicKey = (await this.localStorageService.upload(file))
          .publicKey;
        const localLocation = process.env.BE_HOST + '/file/local/' + publicKey;
        response.Location = localLocation;
        this.logger.log('Path: ' + localLocation);
        return response;
    }
  }

  async uploadBase64File(base64EncodedFile: string, providerDto?: ProviderDTO) {
    const PROVIDER = providerDto?.provider || process.env.FILE_SPACE_PROVIDER;
    this.logger.log(PROVIDER + ' Provider');
    const AWS_BUCKET_FOLDER = process.env.AWS_S3_BUCKET_FOLDER;
    const response = {
      Location: '',
      provider: PROVIDER,
    };

    switch (PROVIDER) {
      case MediaProvider.AWS_S3:
        const awsLocation = await this.awsS3Service.uploadBase64FileToS3(
          base64EncodedFile,
          AWS_BUCKET_FOLDER,
        );
        response.Location = awsLocation.Location;
        return response;
      // Todo: make Digital OCean upload active for base64Encoded upload
      // case MediaProvider.DO_SPACE:
      //     const doLocation = await this.doSpacesService.uploadToDOSpace(
      //       file,
      //       AWS_BUCKET_FOLDER,
      //     );
      //     response.Location = doLocation.Location;
      //     return response;
    }
  }

  async uploadBase64Files(
    base64EncodedStrings: string[],
  ): Promise<{ images: string[] | undefined }> {
    const images = [];
    let uploadedData: string | any;
    if (base64EncodedStrings) {
      try {
        const uploadPromises = base64EncodedStrings.map(async (e) => {
          return await this.uploadBase64File(e);
        });

        uploadedData = await Promise.all(uploadPromises);
        console.log('All images uploaded successfully:', uploadedData);
      } catch (error) {
        console.error('Error uploading images:', error);
        throw new HttpException(error, error.status || HttpStatus.BAD_REQUEST, {
          cause: new Error(error),
        });
      }
    }

    for (const data of uploadedData) {
      // const mimeType = await getMimeTypeFromUrl(data.Location); // Todo: For some reason for a base64encoded image buffer is false. Fix this.
      const mediaDTO = new MediaDto();
      mediaDTO.uri = data.Location;
      mediaDTO.provider = data.provider;
      // mediaDTO.mimetype = mimeType;
      images.push(mediaDTO);
    }
    return {
      images: images.length > 0 ? images : undefined,
      // videos: uploadedData.Location // Todo: this videos needs to be fixed
    };
  }
}
