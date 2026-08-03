import { http } from '@/lib/http'
import type { ConversationDetailOut, ConversationSummaryOut } from '../types'
import type { PaginatedResponse } from '@/types/pagination'
import type { MessageOut } from '@/features/chat/types'

export interface ListConversationsParams {
  includeHidden?: boolean
  limit?: number
  offset?: number
}

// Nota: '/api/conversations/' REQUIERE trailing slash (OpenAPI).
export function listConversations(params: ListConversationsParams = {}) {
  return http.get<PaginatedResponse<ConversationSummaryOut>>('/api/conversations/', {
    query: {
      include_hidden: params.includeHidden,
      limit: params.limit,
      offset: params.offset,
    },
  })
}

export function createConversation() {
  return http.post<ConversationDetailOut>('/api/conversations/')
}

export function getConversation(conversationId: number) {
  return http.get<ConversationDetailOut>(`/api/conversations/${conversationId}`)
}

export function getConversationMessages(conversationId: number) {
  return http.get<MessageOut[]>(`/api/conversations/${conversationId}/messages`)
}

export function hideConversation(conversationId: number) {
  return http.delete<ConversationSummaryOut>(`/api/conversations/${conversationId}`)
}