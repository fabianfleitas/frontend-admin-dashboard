import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hideConversation } from '../api/conversations.service'

export function useHideConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: number) => hideConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}