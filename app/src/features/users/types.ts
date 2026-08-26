import type { PaginatedResponse } from '@/types/pagination'

export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN'

/** Membresía institucional activa según `tipo_miembro`. */
export type MemberType = 'ADMIN' | 'SECRETARIA' | 'ESTUDIANTE'

export interface UserOut {
  external_auth_id: string
  email: string | null
  full_name: string | null
  role: UserRole
  institucion_id: number | null
  tipo_miembro: MemberType | null
  is_platform_admin: boolean
  nombre_institucion: string | null | undefined
  created_at: string
  updated_at: string
}

export type UsersPaginated = PaginatedResponse<UserOut>

export interface ListUsersParams {
  limit?: number
  offset?: number
}