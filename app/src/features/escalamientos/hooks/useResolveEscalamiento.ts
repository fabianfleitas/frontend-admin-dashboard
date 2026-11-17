import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resolveEscalamiento } from '../api/escalamientos.service'
import { toast } from '@/stores/toast.store'

export function useResolveEscalamiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: number) => resolveEscalamiento(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['escalamientos'] })
      toast.success('Escalamiento resuelto', 'El caso quedó marcado como atendido.')
    },
    onError: () => {
      toast.error('No fue posible resolver el escalamiento.', 'Inténtalo nuevamente.')
    },
  })
}