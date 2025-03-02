import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocialDocument = Social & Document;

@Schema()
export class Social {
  @Prop()
  type: string;

  @Prop()
  url: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SocialSchema = SchemaFactory.createForClass(Social);
