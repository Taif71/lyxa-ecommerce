import {
  ApiProperty,
  OmitType
} from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class CreateUserProfileDto
  extends OmitType(UserProfileDto, [
    'user',
    'bio',
    'dob',
    'gender',
    'mobile',
    'location',
    'socials',
    'profilePic',
    'coverPic',
    'profilePercentage',
    'language',
    'isActive',
    'isDeleted',
    'cTime',
    'cBy',
    'uTime',
    'uBy'
  ] as const)
  implements Readonly<CreateUserProfileDto> {
  constructor(data?: {
    firstName: string;
    middleName?: string;
    lastName?: string;
    timezone?: string;
  }) {
    super(data);
  }
}
