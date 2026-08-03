export interface PaginationMeta {
  total: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}