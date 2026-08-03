import type { PaginatedResponse } from '@/types/pagination'

export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN'

export interface UserOut {
  external_auth_id: string
  email: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type UsersPaginated = PaginatedResponse<UserOut>

export interface ListUsersParams {
  limit?: number
  offset?: number
}