import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends OmitType(
  UserDto, [
    'email',
    'password',
    'otp',
    'otpExpiresAt',
    'emailProofToken',
    'emailProofTokenExpiresAt',
    'passwordResetToken',
    'passwordResetTokenExpiresAt',
    'isSuperAdmin',
    'cTime',
    'cBy',
    'uTime',
    'uBy'
  ] as const
)
  implements Readonly<UpdateUserDto> {
  constructor() {
    super();
  }
}
