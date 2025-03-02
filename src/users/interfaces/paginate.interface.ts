import { IPaginate } from '../../common/interfaces/paginate.interface';
import { IUserProfile } from './user-profile.interface';

export interface IUserProfiles extends IPaginate {
  data: IUserProfile[];
}
