import { useQuery } from '@tanstack/react-query'
import { listSubscriptionHistory } from '../api/billing.service'

export function useSubscriptionHistory(params?: { limit?: number; offset?: number }) {
  return useQuery({ queryKey: ['billing', 'subscription-history', params], queryFn: () => listSubscriptionHistory(params) })
}
