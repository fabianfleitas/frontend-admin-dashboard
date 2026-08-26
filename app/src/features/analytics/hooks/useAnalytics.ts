import { useMetrics } from '@/features/dashboard/hooks/useMetrics'
import type { AnalyticsFilters } from '../types'
import { DEFAULT_FILTERS } from '../types'

function buildFilters(f: AnalyticsFilters) {
  const now = new Date()
  const desde = f.period === 'day'
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]
    : f.period === 'week'
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : f.period === 'month'
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined
  const hasta = f.period === 'all' ? undefined : now.toISOString().split('T')[0]
  return {
    desde,
    hasta,
    categoria_id: f.category ? Number(f.category) : undefined,
    granularidad: 'day' as const,
  }
}

export function useAnalytics(filters = DEFAULT_FILTERS) {
  const metricsFilters = buildFilters(filters)
  return useMetrics(metricsFilters)
}
