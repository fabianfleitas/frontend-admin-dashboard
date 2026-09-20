import { http } from '@/lib/http'
import type {
  PlanOut,
  SubscriptionOut,
  PagoOut,
  ComprobanteOut,
  StripeSubscriptionOut,
  CheckoutSessionIn,
  CheckoutSessionOut,
  StripePortalSessionIn,
  StripePortalSessionOut,
  SubscriptionActionOut,
  SubscriptionCancelIn,
  SubscriptionChangePlanIn,
  SubscriptionChangePlanOut,
  StripePlanSyncIn,
  StripePlanSyncOut,
  SubscriptionHistoryOut,
} from '../types'
import type { PaginatedResponse } from '@/types/pagination'

export function getPlan(): Promise<PlanOut> {
  return http.get<PlanOut>('/api/admin/plan')
}

export function listPlans(): Promise<PlanOut[]> {
  return http.get<PlanOut[]>('/api/admin/plans')
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

export function getStripeSubscription(): Promise<StripeSubscriptionOut> {
  return http.get<StripeSubscriptionOut>('/api/admin/stripe/subscription')
}

export function listSubscriptionHistory(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<SubscriptionHistoryOut>>('/api/admin/subscription/history', { query: { limit: params?.limit, offset: params?.offset } })
}

export function createCheckoutSession(body: CheckoutSessionIn): Promise<CheckoutSessionOut> {
  return http.post<CheckoutSessionOut>('/api/admin/stripe/checkout', { body })
}

export function createPortalSession(body: StripePortalSessionIn): Promise<StripePortalSessionOut> {
  return http.post<StripePortalSessionOut>('/api/admin/stripe/portal-session', { body })
}

export function cancelSubscription(body: SubscriptionCancelIn = {}): Promise<SubscriptionActionOut> {
  return http.post<SubscriptionActionOut>('/api/admin/stripe/cancel-subscription', { body })
}

export function reactivateSubscription(): Promise<SubscriptionActionOut> {
  return http.post<SubscriptionActionOut>('/api/admin/stripe/reactivate-subscription')
}

export function changePlan(body: SubscriptionChangePlanIn): Promise<SubscriptionChangePlanOut> {
  return http.post<SubscriptionChangePlanOut>('/api/admin/stripe/change-plan', { body })
}

export function syncPlanWithStripe(body: StripePlanSyncIn): Promise<StripePlanSyncOut> {
  return http.post<StripePlanSyncOut>('/api/admin/stripe/sync-plan', { body })
}
