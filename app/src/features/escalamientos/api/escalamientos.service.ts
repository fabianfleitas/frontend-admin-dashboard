import { http } from '@/lib/http'
import type { EscalamientosPaginated, ListEscalamientosParams } from '../types'

export function listEscalamientos(params: ListEscalamientosParams = {}) {
  return http.get<EscalamientosPaginated>('/api/admin/escalamientos', {
    query: {
      estado: params.estado ?? null,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    },
  })
}

export function resolveEscalamiento(notificationId: number) {
  return http.post<never>(`/api/admin/escalamientos/${notificationId}/resolve`)
}