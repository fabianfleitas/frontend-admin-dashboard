import type { PaginatedResponse } from '@/types/pagination'

export interface AuditLogOut {
  id: string
  mensaje_id: number
  score_fidelidad: number | null
  score_relevancia: number | null
  score_contexto: number | null
  observaciones: string | null
  fecha_evaluacion: string
}

export type AuditPaginated = PaginatedResponse<AuditLogOut>

export interface ListAuditParams {
  limit?: number
  offset?: number
}