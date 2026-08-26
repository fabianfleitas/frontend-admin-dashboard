import { useQuery } from '@tanstack/react-query'
import { getPlatformAudit } from '../api/platform.service'

export function usePlatformAudit(params?: { limit?: number; offset?: number; desde?: string; hasta?: string; modelo?: string }) {
  return useQuery({
    queryKey: ['platform', 'audit', params],
    queryFn: () => getPlatformAudit(params),
  })
}
