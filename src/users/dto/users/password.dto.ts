import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordDto implements Readonly<PasswordDto> {
  @ApiProperty({
    example: '8tJ!ACq7fXg6@#',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  password: string;
}
