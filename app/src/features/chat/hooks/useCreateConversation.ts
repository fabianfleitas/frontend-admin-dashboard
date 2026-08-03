import { useMutation } from '@tanstack/react-query'
import { createConversation } from '@/features/conversations/api/conversations.service'
import type { ConversationDetailOut } from '@/features/conversations/types'

export function useCreateConversation() {
  return useMutation<ConversationDetailOut, Error, void>({
    mutationFn: createConversation,
  })
}