import { http } from '@/lib/http'
import type { MetricsOut, ReadyOut, MetricsFilters } from '../types'

export function getReady(): Promise<ReadyOut> {
  return http.get<ReadyOut>('/ready')
}

export function getMetrics(filters?: MetricsFilters): Promise<MetricsOut> {
  return http.get<MetricsOut>('/api/admin/metrics', {
    query: {
      desde: filters?.desde,
      hasta: filters?.hasta,
      categoria_id: filters?.categoria_id,
      modelo: filters?.modelo,
      documento_id: filters?.documento_id,
      granularidad: filters?.granularidad,
    },
  })
}