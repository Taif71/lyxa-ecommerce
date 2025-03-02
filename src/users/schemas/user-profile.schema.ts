import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from './users.schema';
import {
  LocationDocument,
  LocationSchema,
  MobileDocument,
  MobileSchema,
  MediaDocument,
  MediaSchema,
  SocialDocument,
  SocialSchema,
} from '../../common/schemas';
import { Language, SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';

export type UserProfileDocument = UserProfile & Document;

@Schema()
export class UserProfile extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
    unique: true,
  })
  user: UserDocument;

  @Prop({
    maxlength: 30,
  })
  firstName: string;

  @Prop({
    maxlength: 30,
  })
  lastName: string;

  @Prop({
    maxlength: 120,
  })
  bio: string;

  @Prop()
  dob: number;

  @Prop()
  gender: string;

  @Prop({
    type: MobileSchema,
  })
  mobile: MobileDocument;

  @Prop({
    type: LocationSchema,
  })
  location: LocationDocument;

  @Prop({
    type: [SocialSchema],
    default: undefined,
  })
  socials: SocialDocument[];

  @Prop({
    type: MediaSchema,
  })
  profilePic: MediaDocument;

  @Prop({
    type: MediaSchema,
  })
  coverPic: MediaDocument;

  @Prop({ default: 0 })
  profilePercentage: number;

  @Prop({ default: Language.ENGLISH })
  language: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

UserProfileSchema.set('toJSON', {
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      user: ret.user,
      firstName: ret.firstName,
      middleName: ret.middleName,
      lastName: ret.lastName,
      bio: ret.bio,
      dob: ret.dob,
      gender: ret.gender,
      mobile: ret.mobile,
      location: ret.location,
      socials: ret.socials,
      profilePic: ret.profilePic,
      coverPic: ret.coverPic,
      isProfileCreated: ret.isProfileCreated,
      profilePercentage: ret.profilePercentage,
      language: ret.language,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
