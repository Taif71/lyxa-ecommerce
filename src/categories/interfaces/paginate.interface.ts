import { IPaginate } from '../../common/interfaces/paginate.interface';
import { ICategory } from './categories.interface';

export interface ICategories extends IPaginate {
  data: ICategory[];
}
