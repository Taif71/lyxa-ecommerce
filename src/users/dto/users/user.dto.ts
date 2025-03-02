import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/dto';
import { IUser } from '../../interfaces';
import * as bcrypt from 'bcrypt';

export class UserDto extends BaseDto implements Readonly<UserDto> {
  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '8tJ!ACq7fXg6@#',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  password: string;

  @ApiProperty()
  otp: number;

  @ApiProperty()
  otpExpiresAt: number;

  @ApiProperty()
  emailProofToken: string;

  @ApiProperty()
  emailProofTokenExpiresAt: number;

  @ApiProperty()
  passwordResetToken: string;

  @ApiProperty()
  passwordResetTokenExpiresAt: number;

  @ApiProperty()
  fcmToken: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  isSuperAdmin: boolean;

  @ApiProperty()
  isVerified: boolean;

  constructor(data?: IUser) {
    super(data);
    if (data) {
      data.email && (this.email = data.email);
      data.password && (this.password = bcrypt.hashSync(data.password, 8));
      data.otp && (this.otp = data.otp);
      data.otpExpiresAt && (this.otpExpiresAt = data.otpExpiresAt);
      data.emailProofToken && (this.emailProofToken = data.emailProofToken);
      data.emailProofTokenExpiresAt &&
        (this.emailProofTokenExpiresAt = data.emailProofTokenExpiresAt);
      data.passwordResetToken &&
        (this.passwordResetToken = data.passwordResetToken);
      data.passwordResetTokenExpiresAt &&
        (this.passwordResetTokenExpiresAt = data.passwordResetTokenExpiresAt);
      data.hasOwnProperty('isAdmin') && (this.isAdmin = data.isAdmin);
      data.hasOwnProperty('isActive') && (this.isActive = data.isActive);
      data.hasOwnProperty('isSuperAdmin') &&
        (this.isSuperAdmin = data.isSuperAdmin);
      data.hasOwnProperty('isVerified') && (this.isVerified = data.isVerified);
      data.hasOwnProperty('fcmToken') && (this.fcmToken = data.fcmToken);
    }
  }
}
