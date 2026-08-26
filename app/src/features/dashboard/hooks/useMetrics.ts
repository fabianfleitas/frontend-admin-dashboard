import { useQuery } from '@tanstack/react-query'
import { getMetrics } from '../api/dashboard.service'
import type { MetricsFilters } from '../types'

export function useMetrics(filters?: MetricsFilters) {
  return useQuery({
    queryKey: ['metrics', filters],
    queryFn: () => getMetrics(filters),
  })
}
