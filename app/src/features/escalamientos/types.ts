import type { PaginatedResponse } from '@/types/pagination'

/** Escalamiento a operador humano (`GET /api/admin/escalamientos`). */
export interface EscalamientoOut {
  id: number
  institucion_id: number | null
  motivo: string
  resumen: string | null
  conversacion_id: number | null
  mensaje_id: number | null
  audit_id: string | null
  external_auth_id: string | null
  workflow_estado: 'PENDING' | 'RESOLVED' | 'CANCELLED' | string
  resolved_by: string | null
  resolved_at: string | null
  created_at: string | null
}

export type EscalamientosPaginated = PaginatedResponse<EscalamientoOut>

export interface ListEscalamientosParams {
  estado?: string | null
  limit?: number
  offset?: number
}