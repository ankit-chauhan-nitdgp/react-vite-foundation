export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  meta?: Record<string, unknown>
}

export interface ApiErrorPayload {
  code?: string
  message: string
  details?: Record<string, unknown>
  fieldErrors?: Record<string, string[]>
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>

export interface ListParams extends PaginationParams {
  filters?: Record<string, unknown>
}
