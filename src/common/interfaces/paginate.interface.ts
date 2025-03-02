/**
 * total: number of docs present against a query
 */
export interface IPaginate {
  pagination?: {
    total: number;
    limit: number;
    skip: number;
  };
}
