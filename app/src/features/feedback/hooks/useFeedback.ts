import { useQuery } from '@tanstack/react-query'
import { listFeedback } from '../api/feedback.service'
import type { ListFeedbackParams } from '../types'

export function useFeedback(params: ListFeedbackParams = {}) {
  return useQuery({
    queryKey: ['feedback', params.rating ?? 0, params.limit ?? 20, params.offset ?? 0],
    queryFn: () => listFeedback(params),
    placeholderData: (prev) => prev,
  })
}