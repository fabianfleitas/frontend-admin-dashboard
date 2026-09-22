import { http } from '@/lib/http'
import type { ListFeedbackParams, FeedbackPaginated } from '../types'

export function listFeedback(params: ListFeedbackParams = {}) {
  return http.get<FeedbackPaginated>('/api/admin/feedback', {
    query: {
      rating: params.rating ?? null,
      conversacion_id: params.conversacion_id ?? null,
      message_id: params.message_id ?? null,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    },
  })
}

export function deleteFeedback(feedbackId: number) {
  return http.delete<void>(`/api/admin/feedback/${feedbackId}`)
}