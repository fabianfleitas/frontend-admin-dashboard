import { http } from '@/lib/http'
import type { ConfigParamIn, ConfigParamOut, NotificationOut, SendTestIn, SmtpConfigIn, SmtpConfigOut } from '../types'
import type { PaginatedResponse } from '@/types/pagination'

export function getConfig(): Promise<ConfigParamOut[]> {
  return http.get<ConfigParamOut[]>('/api/admin/config')
}

export function updateConfig(clave: string, body: ConfigParamIn): Promise<ConfigParamOut> {
  return http.put<ConfigParamOut>(`/api/admin/config/${encodeURIComponent(clave)}`, { body })
}

export function getSmtpConfig(): Promise<SmtpConfigOut> {
  return http.get<SmtpConfigOut>('/api/admin/smtp')
}

export function updateSmtpConfig(body: SmtpConfigIn): Promise<SmtpConfigOut> {
  return http.put<SmtpConfigOut>('/api/admin/smtp', { body })
}

export function listNotifications(params?: { limit?: number; offset?: number }) {
  return http.get<PaginatedResponse<NotificationOut>>('/api/admin/notifications', { query: params })
}

export function sendTestNotification(body: SendTestIn): Promise<NotificationOut> {
  return http.post<NotificationOut>('/api/admin/notifications/send-test', { body })
}
