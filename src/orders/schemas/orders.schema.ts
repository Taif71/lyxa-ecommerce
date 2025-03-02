import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/schemas';
import { ProductDocument } from '../../products/schemas';
import { Base } from '../../common/schemas';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELED = 'Canceled',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Order extends Base {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  customer: UserDocument;

  @Prop({
    type: [
      {
        product: { type: SchemaTypes.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    required: true,
  })
  items: {
    product: ProductDocument;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  totalPrice: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    type: String,
    required: true,
  })
  shippingAddress: string;

  @Prop({
    type: String,
    required: true,
  })
  billingAddress: string;

  @Prop({
    type: String,
    required: false,
  })
  trackingNumber?: string;

  @Prop({
    type: Date,
    required: false,
  })
  deliveredAt?: Date;

  @Prop({
    type: Date,
    required: false,
  })
  canceledAt?: Date;

  @Prop({
    type: SchemaTypes.Mixed,
    required: false,
  })
  paymentDetails?: {
    method: string;
    transactionId?: string;
    paymentDate?: Date;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
