import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto implements Readonly<FileUploadDto> {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
