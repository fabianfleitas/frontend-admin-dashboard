import { http } from '@/lib/http'
import type { ConfigParamIn, ConfigParamOut } from '../types'

export function getConfig(): Promise<ConfigParamOut[]> {
  return http.get<ConfigParamOut[]>('/api/admin/config')
}

export function updateConfig(clave: string, body: ConfigParamIn): Promise<ConfigParamOut> {
  return http.put<ConfigParamOut>(`/api/admin/config/${encodeURIComponent(clave)}`, { body })
}
