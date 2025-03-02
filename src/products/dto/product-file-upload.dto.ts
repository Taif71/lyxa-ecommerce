import { ApiProperty } from '@nestjs/swagger';

export class ProductFileUploadDto implements Readonly<ProductFileUploadDto> {
  @ApiProperty({ type: 'string', format: 'binary' })
  images: Express.Multer.File[];

  @ApiProperty({ type: 'string', format: 'binary' })
  videos: Express.Multer.File[];
}
