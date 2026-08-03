import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadNewVersion } from '../api/documents.service'

export function useUploadVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentoId, file }: { documentoId: number; file: File }) =>
      uploadNewVersion(documentoId, file),
    onSuccess: (_data, { documentoId }) => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
      void queryClient.invalidateQueries({ queryKey: ['document', documentoId] })
    },
  })
}