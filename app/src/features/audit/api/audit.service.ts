import { http } from '@/lib/http'
import type { AuditPaginated, ListAuditParams } from '../types'

export function getAudit(params: ListAuditParams = {}) {
  return http.get<AuditPaginated>('/api/admin/audit', {
    query: { limit: params.limit, offset: params.offset },
  })
}