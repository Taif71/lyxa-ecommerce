export interface IBase {
    readonly isActive?: boolean;
    readonly isDeleted?: boolean;
    readonly cTime?: number;
    readonly cBy?: string;
    readonly uTime?: number;
    readonly uBy?: string;
    readonly timezone?: string;
}
