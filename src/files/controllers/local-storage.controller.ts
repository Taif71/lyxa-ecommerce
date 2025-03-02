import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  HttpCode,
  Patch,
  Post,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDTO } from '../dto/file-upload.dto';
import { LocalStorageService } from '../services';

@ApiTags('File Upload')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('file')
export class LocalStorageController {
  constructor(private readonly localStorageService: LocalStorageService) {}

  /**
   * upload files
   * @param {Express.Multer.File} file
   * @returns
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image Upload to Local' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return upload information.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  @UseInterceptors(FileInterceptor('file'))
  @ApiExcludeEndpoint()
  @Post('local/upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.localStorageService.upload(file);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('local/upload')
  public getUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('local/upload')
  public putUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('local/upload')
  public patchUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('local/upload')
  public deleteUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * read files
   * @param {string} publicKey
   * @param {Response} res
   * @returns
   */
  @ApiOperation({ summary: 'File or Image get from Local' })
  @ApiExcludeEndpoint()
  @Get('local/:publicKey')
  async getFile(@Param('publicKey') publicKey: string, @Res() res) {
    try {
      const file = await this.localStorageService.getFile(publicKey);
      return file.pipe(res);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete files
   * @param {string} privateKey
   * @returns
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image delete from Local' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return delete information.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @HttpCode(204)
  @ApiExcludeEndpoint()
  @Delete('local/delete/:privateKey')
  removeFile(@Param('privateKey') privateKey: string) {
    try {
      return this.localStorageService.delete(privateKey);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Post('local/delete/:key')
  public postFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('local/delete/:key')
  public putFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('local/delete/:key')
  public patchFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
