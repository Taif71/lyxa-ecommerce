import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class User extends Base {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  otp: number;

  @Prop()
  otpExpiresAt: number;

  @Prop()
  emailProofToken: string;

  @Prop()
  emailProofTokenExpiresAt: number;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetTokenExpiresAt: number;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('profile', {
  ref: SCHEMA.USER_PROFILE,
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      email: ret.email,
      isActive: ret.isActive,
      isVerified: ret.isVerified,
      isRegistered: ret.isRegistered,
      isAdmin: ret.isAdmin,
      isSuperAdmin: ret.isSuperAdmin,
      profile: ret.profile,
      fcmToken: ret.fcmToken,
      cTime: ret.cTime,
    };
  },
});
