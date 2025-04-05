export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success?: boolean;
  error?: string;
}
