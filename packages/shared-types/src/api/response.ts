// API 响应通用类型

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiListResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
}
