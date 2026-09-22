import type { PaginatedResponse } from '@/types/pagination'

/** Feedback de usuario sobre un mensaje del asistente (`GET /api/admin/feedback`). */
export interface AdminFeedbackOut {
  id: number
  message_id: number
  conversacion_id: number | null
  rating: number
  comment: string | null
  external_auth_id: string | null
  contenido_texto: string | null
  audit_id: string | null
  created_at: string | null
}

export type FeedbackPaginated = PaginatedResponse<AdminFeedbackOut>

export interface ListFeedbackParams {
  rating?: number | null
  conversacion_id?: number | null
  message_id?: number | null
  limit?: number
  offset?: number
}