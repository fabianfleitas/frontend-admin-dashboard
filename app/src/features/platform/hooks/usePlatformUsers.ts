import { useQuery } from '@tanstack/react-query'
import { getPlatformUsers } from '../api/platform.service'

export function usePlatformUsers(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['platform', 'users', params],
    queryFn: () => getPlatformUsers(params),
  })
}
