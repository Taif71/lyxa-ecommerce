import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto implements Readonly<ResetPasswordDto> {
  @ApiProperty({
    example: '8tJ!ACq7fXg6@#',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  currentPassword: string;

  @ApiProperty({
    example: '9Jt#ACq8Xfg6%!',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  newPassword: string;
}
