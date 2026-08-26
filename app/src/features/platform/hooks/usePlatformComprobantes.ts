import { useQuery } from '@tanstack/react-query'
import { listPlatformComprobantes } from '../api/platform.service'

export function usePlatformComprobantes(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['platform', 'comprobantes', params],
    queryFn: () => listPlatformComprobantes(params),
  })
}
