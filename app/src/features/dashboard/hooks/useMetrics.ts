import { useQuery } from '@tanstack/react-query'
import { getMetrics } from '../api/dashboard.service'

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: getMetrics,
  })
}