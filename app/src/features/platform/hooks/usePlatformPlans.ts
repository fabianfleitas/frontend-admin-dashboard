import { useQuery } from '@tanstack/react-query'
import { listPlatformPlans } from '../api/platform.service'

export function usePlatformPlans() {
  return useQuery({ queryKey: ['platform', 'plans'], queryFn: listPlatformPlans })
}
