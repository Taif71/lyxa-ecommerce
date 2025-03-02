export interface ILocation {
  readonly _id: string;
  readonly address?: string;
  readonly city?: string;
  readonly state?: string;
  readonly country?: string;
  readonly zipCode?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly isCurrent?: boolean;
  readonly isPermanent?: boolean;
  readonly isDeleted?: boolean;
}
