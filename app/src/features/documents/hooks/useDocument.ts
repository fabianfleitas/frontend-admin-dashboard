import { useQuery } from '@tanstack/react-query'
import { getDocument } from '../api/documents.service'

export function useDocument(documentoId: number | null) {
  return useQuery({
    queryKey: ['document', documentoId],
    queryFn: () => getDocument(documentoId as number),
    enabled: documentoId !== null,
  })
}