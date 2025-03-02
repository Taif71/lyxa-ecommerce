export interface IMobile {
    readonly _id: string;
    readonly countryCode?: string;
    readonly mobile?: string;
    readonly isVerified?: boolean;
    readonly isVisible?: boolean;
    readonly isPrimary?: boolean;
    readonly isDeleted?: boolean;
  }
  