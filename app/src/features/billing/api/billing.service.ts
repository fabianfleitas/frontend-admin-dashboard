import { http } from '@/lib/http'
import type { PlanOut, SubscriptionOut, PagoOut, ComprobanteOut } from '../types'

export function getPlan(): Promise<PlanOut> {
  return http.get<PlanOut>('/api/admin/plan')
}

export function getSubscription(): Promise<SubscriptionOut> {
  return http.get<SubscriptionOut>('/api/admin/subscription')
}

export function listPagos(params?: { limit?: number; offset?: number }) {
  return http.get<{ items: PagoOut[]; pagination: { total: number; limit: number; offset: number } }>('/api/admin/pagos', { query: { limit: params?.limit, offset: params?.offset } })
}

export function listComprobantes(params?: { limit?: number; offset?: number }) {
  return http.get<{ items: ComprobanteOut[]; pagination: { total: number; limit: number; offset: number } }>('/api/admin/comprobantes', { query: { limit: params?.limit, offset: params?.offset } })
}
