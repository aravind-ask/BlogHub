export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}