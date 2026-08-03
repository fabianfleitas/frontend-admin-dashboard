import { useQuery } from '@tanstack/react-query'
import { listConversations } from '../api/conversations.service'

export interface UseConversationsParams {
  includeHidden?: boolean
  limit?: number
  offset?: number
}

export function useConversations(params: UseConversationsParams = {}) {
  return useQuery({
    queryKey: ['conversations', params.includeHidden ?? false, params.limit ?? 20, params.offset ?? 0],
    queryFn: () => listConversations(params),
    placeholderData: (prev) => prev,
  })
}