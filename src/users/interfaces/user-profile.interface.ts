import { IMedia, IMobile, ILocation } from '../../common/interfaces';
import { IBase, ISocial } from '../../common/interfaces'

export interface IUserProfile extends IBase {
  readonly _id?: string;
  readonly user?: string;
  readonly firstName?: string;
  readonly middleName?: string;
  readonly lastName?: string;
  readonly bio?: string;
  readonly dob?: number;
  readonly gender?: string;
  readonly mobile?: IMobile;
  readonly location?: ILocation;
  readonly socials?: [ISocial];
  readonly profilePic?: IMedia;
  readonly coverPic?: IMedia;
  readonly profilePercentage?: number;
  readonly language?: string;
}
