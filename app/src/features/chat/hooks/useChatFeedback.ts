import { useMutation } from '@tanstack/react-query'
import { sendFeedback } from '../api/chat.service'
import type { ChatFeedbackIn, ChatFeedbackOut } from '../types'

export function useChatFeedback() {
  return useMutation<ChatFeedbackOut, Error, ChatFeedbackIn>({
    mutationFn: sendFeedback,
  })
}