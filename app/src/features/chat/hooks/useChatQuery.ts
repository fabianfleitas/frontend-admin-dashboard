import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '../api/chat.service'
import type { ChatQueryIn, ChatQueryOut } from '../types'

export function useChatQuery() {
  const queryClient = useQueryClient()
  return useMutation<ChatQueryOut, Error, ChatQueryIn>({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversation_id] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}