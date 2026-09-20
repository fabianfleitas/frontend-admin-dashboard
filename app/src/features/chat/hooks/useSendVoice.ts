import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendVoice } from '../api/chat.service'
import type { ChatVoiceOut } from '../types'

export interface SendVoiceInput {
  conversationId: number
  file: File
}

export function useSendVoice() {
  const queryClient = useQueryClient()
  return useMutation<ChatVoiceOut, Error, SendVoiceInput>({
    mutationFn: ({ conversationId, file }) => sendVoice(conversationId, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversation_id] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}