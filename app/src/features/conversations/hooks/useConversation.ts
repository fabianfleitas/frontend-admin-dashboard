import { useQuery } from '@tanstack/react-query'
import { getConversation } from '../api/conversations.service'

export function useConversation(conversationId: number | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId as number),
    enabled: conversationId !== null,
  })
}