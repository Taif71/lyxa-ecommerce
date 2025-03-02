import { IBase, IMedia } from '../../common/interfaces'

export interface ICategory extends IBase {
    readonly _id?: string;
    readonly name?: string;
    readonly parentCategory?: string;
    readonly image?: IMedia;
}
