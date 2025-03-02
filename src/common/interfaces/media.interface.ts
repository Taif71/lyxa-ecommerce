export interface IMedia {
  readonly _id: string;
  uri?: string;
  readonly provider?: string;
  readonly mimetype?: string;
  readonly type?: string;
  readonly isDeleted?: boolean;
}
