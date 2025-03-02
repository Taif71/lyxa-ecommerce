import { IPaginate } from '../../common/interfaces/paginate.interface';
import { ICart } from './cart.interface';

export interface ICarts extends IPaginate {
  data: ICart[];
}
