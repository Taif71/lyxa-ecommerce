import { ProductDocument } from '../../products/schemas';
import { UserDocument } from '../../users/schemas';

export interface ICart {
  user: UserDocument;
  items: Array<{
    product: ProductDocument;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
}
