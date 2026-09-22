import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFeedback } from '../api/feedback.service'
import { toast } from '@/stores/toast.store'

export function useDeleteFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (feedbackId: number) => deleteFeedback(feedbackId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feedback'] })
      toast.success('Feedback eliminado', 'El feedback se ocultó del listado.')
    },
    onError: () => {
      toast.error('No fue posible eliminar el feedback.', 'Inténtalo nuevamente.')
    },
  })
}