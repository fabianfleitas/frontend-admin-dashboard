import { useQuery } from '@tanstack/react-query'
import { listPagos } from '../api/billing.service'

export function usePagos(params?: { limit?: number; offset?: number }) {
  return useQuery({ queryKey: ['pagos', params], queryFn: () => listPagos(params) })
}
