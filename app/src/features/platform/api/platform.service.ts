import { http } from '@/lib/http'
import type { InstitutionOut, MemberOut, MemberIn } from '../types'
import type { AuditLogOut } from '@/features/audit/types'
import type { PlanOut, SubscriptionOut, PagoOut, ComprobanteOut } from '@/features/billing/types'
import type { MetricsOut } from '@/features/dashboard/types'
import type { UserOut } from '@/features/users/types'
import type { PaginatedResponse } from '@/types/pagination'

export function listInstitutions(query?: { activo?: boolean }) {
  return http.get<InstitutionOut[]>('/api/platform/institutions', { query: query as any })
}

export function getInstitution(id: number) {
  return http.get<InstitutionOut>(`/api/platform/institutions/${id}`)
}

export function listMembers(id: number) {
  return http.get<MemberOut[]>(`/api/platform/institutions/${id}/members`)
}

export function addMember(id: number, payload: MemberIn) {
  return http.post<MemberOut>(`/api/platform/institutions/${id}/members`, { body: payload })
}

export function removeMember(institutionId: number, memberId: number) {
  return http.delete(`/api/platform/institutions/${institutionId}/members/${memberId}`)
}

export function getPlatformMetrics(query?: any) {
  return http.get<MetricsOut>('/api/platform/metrics', { query })
}

export function getPlatformAudit(params?: { limit?: number; offset?: number; desde?: string; hasta?: string; modelo?: string }) {
  return http.get<PaginatedResponse<AuditLogOut>>('/api/platform/audit', { query: params as any })
}

export function listPlatformPlans() {
  return http.get<PlanOut[]>('/api/platform/plans')
}

export function listPlatformSubscriptions(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<SubscriptionOut>>('/api/platform/subscriptions', { query: params })
}

export function listPlatformPagos(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<PagoOut>>('/api/platform/pagos', { query: params })
}

export function listPlatformComprobantes(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<ComprobanteOut>>('/api/platform/comprobantes', { query: params })
}

export function getPlatformUsers(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<UserOut>>('/api/platform/users', { query: params })
}
