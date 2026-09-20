import { useQuery } from '@tanstack/react-query'
import { getAudit } from '../api/audit.service'

export interface UseAuditParams {
  limit?: number
  offset?: number
  enabled?: boolean
}

export function useAudit(params: UseAuditParams = {}) {
  return useQuery({
    queryKey: ['audit', params.limit ?? 20, params.offset ?? 0],
    queryFn: () => getAudit({ limit: params.limit, offset: params.offset }),
    placeholderData: (prev) => prev,
    enabled: params.enabled ?? true,
  })
}