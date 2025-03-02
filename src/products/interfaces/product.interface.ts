import { IBase, IMedia } from '../../common/interfaces';
import { IUser } from '../../users/interfaces';
import { ICategories } from '../../categories/interfaces';
import { AvaibilityStatus } from 'src/common/mock';

export interface IProduct extends IBase {
  seller: string;
  category: string;
  subCategory?: string;
  title: string;
  slug: string;
  description: string;
  status: AvaibilityStatus;
  images?: IMedia[];
  videos?: IMedia[];
  viewCount: number;
  ratings: number;
  price: number;
  stock: number;
  isFeatured: boolean;
  tags: string[];
  variations: Array<{
    variantName: string;
    options: string[];
  }>;
}

