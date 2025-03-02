import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from '../helper/do-space.helper';

@Injectable()
export class DOSpaceService {
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @returns {Promise<Object>}
   */
  async uploadToDOSpace(file: Express.Multer.File, bucketFolder: string) {
    const Bucket = this.AWS_S3_BUCKET + '/' + bucketFolder;
    const { buffer, originalname, mimetype } = file;
    const fileName = `${Date.now()}-${originalname}`;
    const params = {
      Bucket: Bucket,
      Key: String(fileName),
      ContentType: mimetype || 'image/jpeg',
      Body: buffer,
      ACL: 'public-read',
    };
    try {
      return await this.s3.upload(params).promise();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
