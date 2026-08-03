import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateDocument } from '../api/documents.service'

export function useDeactivateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentoId: number) => deactivateDocument(documentoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
      void queryClient.invalidateQueries({ queryKey: ['document'] })
      void queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}