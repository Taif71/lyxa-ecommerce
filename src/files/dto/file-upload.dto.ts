import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO implements Readonly<FileUploadDTO> {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
