import { ApiProperty } from '@nestjs/swagger';

export class UserFileUploadDto implements Readonly<UserFileUploadDto> {
  @ApiProperty({ type: 'string', format: 'binary' })
  profilePic: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  coverPic: Express.Multer.File;
}
