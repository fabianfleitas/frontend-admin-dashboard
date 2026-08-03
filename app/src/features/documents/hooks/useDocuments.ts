import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '../api/documents.service'

export interface UseDocumentsParams {
  limit?: number
  offset?: number
}

export function useDocuments(params: UseDocumentsParams = {}) {
  return useQuery({
    queryKey: ['documents', params.limit ?? 20, params.offset ?? 0],
    queryFn: () => listDocuments({ limit: params.limit, offset: params.offset }),
    placeholderData: (prev) => prev,
  })
}