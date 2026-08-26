import { useQuery } from '@tanstack/react-query'
import { listPlatformPagos } from '../api/platform.service'

export function usePlatformPagos(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['platform', 'pagos', params],
    queryFn: () => listPlatformPagos(params),
  })
}
