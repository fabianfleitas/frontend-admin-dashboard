import { useMetrics } from '@/features/dashboard/hooks/useMetrics'

export function useAnalytics() {
  const metricsQuery = useMetrics()
  return metricsQuery
}