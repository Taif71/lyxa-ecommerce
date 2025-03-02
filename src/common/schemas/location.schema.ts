import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  address: string;

  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  city: string;

  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  state: string;

  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  country: string;

  @Prop()
  zipCode: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
