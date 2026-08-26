import { useQuery } from '@tanstack/react-query'
import { listComprobantes } from '../api/billing.service'

export function useComprobantes(params?: { limit?: number; offset?: number }) {
  return useQuery({ queryKey: ['comprobantes', params], queryFn: () => listComprobantes(params) })
}
