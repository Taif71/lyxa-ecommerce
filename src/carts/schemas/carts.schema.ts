import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProductDocument } from '../../products/schemas';
import { UserDocument } from '../../users/schemas';
import { Base } from '../../common/schemas';
import { CartStatus } from 'src/common/mock';

export type CartDocument = Cart & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  timestamps: true,
})

export class Cart extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: [
      {
        product: { type: SchemaTypes.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    default: [],
  })
  items: {
    product: ProductDocument;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: String,
    enum: Object.values(CartStatus),
    default: CartStatus.ACTIVE,
  })
  status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
