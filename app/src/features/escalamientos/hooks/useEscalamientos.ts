import { useQuery } from '@tanstack/react-query'
import { listEscalamientos } from '../api/escalamientos.service'
import type { ListEscalamientosParams } from '../types'

export function useEscalamientos(params: ListEscalamientosParams = {}) {
  return useQuery({
    queryKey: ['escalamientos', params.estado ?? 'all', params.limit ?? 20, params.offset ?? 0],
    queryFn: () => listEscalamientos(params),
    placeholderData: (prev) => prev,
  })
}