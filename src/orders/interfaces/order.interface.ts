import { IBase, IMedia } from '../../common/interfaces';
import { IUser } from '../../users/interfaces';
import { ICategories } from '../../categories/interfaces';
import { AvaibilityStatus, PaymentStatus } from 'src/common/mock';
import { OrderStatus } from 'aws-sdk/clients/outposts';

export interface IOrder extends IBase {
  customer: string;
  items: Object[];
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;  
  billingAddress: string;
  trackingNumber?: string;
  deliveredAt?: Date;
  canceledAt?: Date;
  paymentDetails?: Object;  
}

