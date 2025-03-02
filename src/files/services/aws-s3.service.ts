import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { generateRandomName } from '../../common/utils/helper';

@Injectable()
export class AwsS3Service {
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  private AWS_REGION = process.env.AWS_REGION;
  private s3: S3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @param {string} bucketFolder
   * @returns {Promise<Object>}
   */
  async uploadToS3(file: Express.Multer.File, bucketFolder: string) {
    const Bucket = this.AWS_S3_BUCKET + '/' + bucketFolder;
    const { buffer, originalname, mimetype } = file;

    const params = {
      Bucket: Bucket,
      Key: String(originalname),
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.AWS_REGION,
      },
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (err) {
      console.log('fffggg', err);
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async uploadBase64FileToS3(base64EncodedFile: string, bucketFolder: string) {
    const Bucket = this.AWS_S3_BUCKET + '/' + bucketFolder;
    const originalname = `ecommerce_${generateRandomName()}`;
    const base64Buffer = Buffer.from(base64EncodedFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    // const type = base64EncodedFile.split(';')[0].split('/')[1];
    const type = 'jpeg'; // Todo: In the future it will be dynamic according to actual file type: image or video
    const params = {
      Bucket: Bucket,
      Key: `${originalname}.${type}`,
      Body: base64Buffer,
      ContentType: `image/${type}`,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.AWS_REGION,
      },
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (err) {
      console.log('fffggg', err);
      const y = '';
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Delete File
   * @param {string} key
   * @returns {Promise<Object>}
   */
  async deleteFile(key: string) {
    try {
      return await this.s3
        .deleteObject({
          Bucket: this.AWS_S3_BUCKET,
          Key: key,
        })
        .promise();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
