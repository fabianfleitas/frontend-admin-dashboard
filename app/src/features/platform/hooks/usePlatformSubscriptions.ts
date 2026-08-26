import { useQuery } from '@tanstack/react-query'
import { listPlatformSubscriptions } from '../api/platform.service'

export function usePlatformSubscriptions(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['platform', 'subscriptions', params],
    queryFn: () => listPlatformSubscriptions(params),
  })
}
