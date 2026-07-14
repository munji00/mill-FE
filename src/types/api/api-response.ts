export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ApiMeta | null;
  errors: ApiError[] | null;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiError {
  field?: string;
  message: string;
}