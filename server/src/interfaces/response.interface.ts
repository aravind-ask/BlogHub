export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  hasMore?: boolean;
  error?: string;
  status: number;
}
export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
