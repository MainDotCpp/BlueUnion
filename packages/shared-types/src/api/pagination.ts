// 分页相关类型

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  current?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
