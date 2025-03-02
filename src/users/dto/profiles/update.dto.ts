import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';
import { IUserProfile } from 'src/users/interfaces';

export class UpdateUserProfileDto
  extends OmitType(UserProfileDto, [
    'user',
    'cTime',
    'cBy',
    'uTime',
    'uBy',
  ] as const)
  implements Readonly<UpdateUserProfileDto>
{
  @ApiProperty({
    type: String,
  })
  base64EncodedProfilePic: string;

  @ApiProperty({
    type: String,
  })
  base64EncodedCoverPic: string;
  constructor(
    data?: Omit<
      IUserProfile,
      'user' | 'cBy' | 'cTime' | 'uBy' | 'uTime'
    >,
  ) {
    super(data);
  }
}
