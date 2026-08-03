import { useQuery } from '@tanstack/react-query'
import { getReady } from '../api/dashboard.service'

export function useReady() {
  return useQuery({
    queryKey: ['ready'],
    queryFn: getReady,
    refetchInterval: 30 * 1000,
  })
}