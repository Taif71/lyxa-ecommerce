import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import { MediaDocument, MediaSchema } from '../../common/schemas';
import { AvaibilityStatus, SCHEMA } from '../../common/mock';
import { Base } from '../../common/schemas';
import { CategoryDocument } from '../../categories/schemas';

export type ProductDocument = Product & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Product extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.USER,
    required: true,
  })
  seller: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.CATEGORY,
    required: true,
  })
  category: CategoryDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.CATEGORY,
    required: false,
  })
  subCategory: CategoryDocument;

  @Prop({
    minlength: 1,
    maxlength: 100,
    required: true,
  })
  title: string;

  @Prop({
    unique: true,
    minlength: 3,
    maxlength: 100,
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
    maxlength: 1000,
  })
  description: string;

  @Prop({
    default: AvaibilityStatus.AVAILABLE,
  })
  status: string;

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  images: MediaDocument[];

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  videos: MediaDocument[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  ratings: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  stock: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isFeatured: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: [SchemaTypes.Mixed],
    default: [],
  })
  variations: Array<{
    variantName: string; // Example: size, color
    options: string[];  // Example: ["S", "M", "L"]
  }>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
