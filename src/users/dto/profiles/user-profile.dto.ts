import {
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  MobileDto,
  LocationDto,
  MediaDto,
  SocialDto,
  BaseDto
} from '../../../common/dto';
import { Language } from '../../../common/mock/constant.mock';
import { IUserProfile } from '../../interfaces';
import {
  ILocation,
  IMedia,
  IMobile,
  ISocial
} from '../../../common/interfaces';

export class UserProfileDto extends BaseDto implements Readonly<UserProfileDto> {
  @ApiProperty()
  @IsMongoId()
  user: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(2)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  firstName: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(2)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  middleName: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(2)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  lastName: string;

  @ApiProperty()
  @MaxLength(120)
  @IsString()
  bio: string;

  @ApiProperty()
  dob: number;

  @ApiProperty()
  gender: string;

  @ApiProperty({
    type: MobileDto,
  })
  @ValidateNested({ each: true })
  @Type(() => MobileDto)
  mobile: IMobile;

  @ApiProperty({
    type: LocationDto,
  })
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  location: ILocation;

  @ApiProperty({
    type: [SocialDto],
  })
  @IsArray()
  socials: [ISocial];

  @ApiProperty({
    type: MediaDto,
  })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  profilePic: IMedia;

  @ApiProperty({
    type: MediaDto,
  })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  coverPic: IMedia;

  @ApiProperty({ default: 0 })
  profilePercentage: number;

  @ApiProperty({ enum: Language })
  @IsEnum(Language)
  language: string;

  constructor(data?: IUserProfile) {
    super(data);
    if (data) {
      data.user && (this.user = data.user);
      data.firstName && (this.firstName = data.firstName);
      data.middleName && (this.middleName = data.middleName);
      data.lastName && (this.lastName = data.lastName);
      data.bio && (this.bio = data.bio);
      data.dob && (this.dob = data.dob);
      data.gender && (this.gender = data.gender);
      data.mobile && (this.mobile = data.mobile);
      data.location && (this.location = data.location);
      data.socials && (this.socials = data.socials);
      data.profilePic && (this.profilePic = data.profilePic);
      data.coverPic && (this.coverPic = data.coverPic);
      data.profilePercentage && (this.profilePercentage = data.profilePercentage);
      data.language && (this.language = data.language);
    }
  }
}
