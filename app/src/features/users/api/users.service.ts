import { http } from '@/lib/http'
import type { ListUsersParams, UsersPaginated } from '../types'

export function listUsers(params: ListUsersParams = {}) {
  return http.get<UsersPaginated>('/api/admin/users', {
    query: { limit: params.limit, offset: params.offset },
  })
}