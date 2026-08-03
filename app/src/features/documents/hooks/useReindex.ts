import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reindex } from '../api/documents.service'

export function useReindex() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentoId?: number) => reindex(documentoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
      void queryClient.invalidateQueries({ queryKey: ['document'] })
      void queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}