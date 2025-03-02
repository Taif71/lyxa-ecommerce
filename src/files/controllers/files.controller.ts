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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
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
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileUploadDTO } from '../dto/file-upload.dto';
import { ProviderDTO } from '../dto/provider.dto';
import { FilesService } from '../services/files.service';

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
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image Upload Dynamic Bucket' })
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
  @UsePipes(new ValidationPipe(true))
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() providerDto?: ProviderDTO,
  ) {
    try {
      return await this.filesService.upload(file, providerDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('upload')
  public uploadGet() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('upload')
  public uploadPatch() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Put('upload')
  public uploadPut() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('upload')
  public uploadDelete() {
    throw new MethodNotAllowedException('Method Not Allowed');
  }
}
