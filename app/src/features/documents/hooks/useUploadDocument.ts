import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadDocument } from '../api/documents.service'
import type { UploadDocumentInput } from '../api/documents.service'

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UploadDocumentInput) => uploadDocument(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}