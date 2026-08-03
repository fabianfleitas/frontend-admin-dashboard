import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../api/users.service'

export interface UseUsersParams {
  limit?: number
  offset?: number
}

export function useUsers(params: UseUsersParams = {}) {
  return useQuery({
    queryKey: ['users', params.limit ?? 20, params.offset ?? 0],
    queryFn: () => listUsers({ limit: params.limit, offset: params.offset }),
    placeholderData: (prev) => prev,
  })
}