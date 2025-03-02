import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../services';
import { FileUploadDTO } from '../dto/file-upload.dto';

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
export class AwsS3Controller {
  private AWS_SERVICE_IMG_BUCKET = process.env.AWS_BUCKET_NAME;
  constructor(private readonly s3Service: AwsS3Service) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image Upload to S3 Bucket' })
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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiExcludeEndpoint()
  @Post('s3/upload')
  async create(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.s3Service.uploadToS3(file, this.AWS_SERVICE_IMG_BUCKET);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('s3/upload')
  public createGet() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('s3/upload')
  public createPatch() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Put('s3/upload')
  public createPut() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('s3/upload')
  public createDelete() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image delete from S3 Bucket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return delete information.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiExcludeEndpoint()
  @Delete('s3/delete')
  async remove(@Body() obj: { key: string }) {
    try {
      return await this.s3Service.deleteFile(obj.key);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('s3/delete')
  public removeGet() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('s3/delete')
  public removePatch() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Put('s3/delete')
  public removePut() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Post('s3/delete')
  public removePost() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }
}
