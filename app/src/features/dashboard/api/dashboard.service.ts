import { http } from '@/lib/http'
import type { MetricsOut, ReadyOut } from '../types'

export function getReady(): Promise<ReadyOut> {
  return http.get<ReadyOut>('/ready')
}

export function getMetrics(): Promise<MetricsOut> {
  return http.get<MetricsOut>('/api/admin/metrics')
}