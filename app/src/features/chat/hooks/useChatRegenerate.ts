import { useMutation, useQueryClient } from '@tanstack/react-query'
import { regenerateMessage } from '../api/chat.service'
import type { ChatRegenerateOut } from '../types'

export function useChatRegenerate() {
  const queryClient = useQueryClient()
  return useMutation<ChatRegenerateOut, Error, number>({
    mutationFn: (conversationId) => regenerateMessage(conversationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversation_id] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}