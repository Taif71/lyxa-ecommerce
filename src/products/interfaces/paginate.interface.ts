import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IProduct } from './product.interface';

export interface IProducts extends IPaginate {
  data: IProduct[];
}
