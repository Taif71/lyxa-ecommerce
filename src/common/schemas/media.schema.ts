import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MediaType } from '../mock/constant.mock';

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop({
    minlength: 10,
    maxlength: 300,
  })
  uri: string;

  @Prop({
    minlength: 3,
    maxlength: 25,
  })
  mimetype: string;

  @Prop({ default: MediaType.IMAGE })
  type: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
