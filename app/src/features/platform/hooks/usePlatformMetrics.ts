import { useQuery } from '@tanstack/react-query'
import { getPlatformMetrics } from '../api/platform.service'
import type { MetricsFilters } from '@/features/dashboard/types'

export function usePlatformMetrics(filters?: MetricsFilters) {
  return useQuery({
    queryKey: ['platform', 'metrics', filters],
    queryFn: () => getPlatformMetrics(filters),
  })
}
