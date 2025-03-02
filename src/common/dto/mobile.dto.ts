import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MobileDto implements Readonly<MobileDto> {
  @ApiProperty()
  @MaxLength(6)
  @MinLength(1)
  @IsString()
  countryCode: string;

  @ApiProperty()
  @MaxLength(15)
  @MinLength(6)
  @IsString()
  mobile: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  isDeleted: boolean;
}
