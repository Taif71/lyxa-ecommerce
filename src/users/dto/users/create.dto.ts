import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CreateUserDto
  extends OmitType(UserDto, [
    'otp',
    'otpExpiresAt',
    'emailProofToken',
    'emailProofTokenExpiresAt',
    'fcmToken',
    'passwordResetToken',
    'passwordResetTokenExpiresAt',
    'isAdmin',
    'isSuperAdmin',
    'isActive',
    'isVerified',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<CreateUserDto>
{
  @ApiProperty({
    required: false,
    example: 'John',
  })
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  firstName: string;

  @ApiProperty({
    required: false,
    example: 'Howard',
  })
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({
    required: false,
    example: 'Smith',
  })
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  lastName: string;

  constructor(data) {
    super(data);
  }
}
