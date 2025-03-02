import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MobilePrefixes } from '../mock/constant.mock';

export type MobileDocument = Mobile & Document;

@Schema()
export class Mobile {
  @Prop({ default: MobilePrefixes.USA, minlength: 1, maxlength: 6 })
  countryCode: string;

  @Prop({
    minlength: 6,
    maxlength: 17,
  })
  mobile: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: false })
  isPrimary: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MobileSchema = SchemaFactory.createForClass(Mobile);
