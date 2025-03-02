import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { encodeToken, decodeToken } from '../../common/utils/helper';
import 'dotenv/config';
import * as fs from 'fs';

@Injectable()
export class LocalStorageService {
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File) {
    try {
      const privateKey = await encodeToken(
        { privateKey: file.filename },
        this.password,
      );
      const publicKey = await encodeToken(
        { publicKey: file.filename },
        this.password,
      );
      return {
        publicKey: publicKey,
        privateKey: privateKey,
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get File
   * @param {string} publicKey
   * @returns
   */
  async getFile(publicKey: string) {
    try {
      const decodePublic = await decodeToken(publicKey, this.password);
      if (!(decodePublic && decodePublic.hasOwnProperty('publicKey'))) {
        return Promise.reject(new BadRequestException('Invalid publicKey'));
      }
      const key = decodePublic.publicKey;
      const filePath = join(process.env.FOLDER, key);
      const isExist = fs.existsSync(filePath);
      if (!isExist)
        return Promise.reject(new NotFoundException('file does not exits'));
      return fs.createReadStream(filePath);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete File
   * @param {string} privateKey
   * @returns
   */
  async delete(privateKey: string) {
    try {
      const decodePrivate = await decodeToken(privateKey, this.password);
      if (!(decodePrivate && decodePrivate.hasOwnProperty('privateKey'))) {
        return Promise.reject(new BadRequestException('Invalid privateKey'));
      }
      const key = decodePrivate.privateKey;
      const filePath = join(process.env.FOLDER, key);
      const isExist = fs.existsSync(filePath);
      if (!isExist)
        return Promise.reject(new NotFoundException('file does not exits'));
      fs.unlinkSync(filePath);
      return {
        message: 'Successfully deleted the file.',
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
