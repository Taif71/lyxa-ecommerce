import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IOrder } from './order.interface';


export interface IOrders extends IPaginate {
  data: IOrder[];
}
