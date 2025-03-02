import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaDto implements Readonly<MediaDto> {
  @ApiProperty()
  @MinLength(10)
  @MaxLength(300)
  @IsString()
  uri: string;

  @ApiProperty()
  @MinLength(3)
  @MaxLength(25)
  @IsString()
  mimetype: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isDeleted: boolean;
}
