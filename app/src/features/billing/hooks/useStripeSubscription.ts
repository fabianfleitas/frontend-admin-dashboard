import { useQuery } from '@tanstack/react-query'
import { getStripeSubscription } from '../api/billing.service'

export function useStripeSubscription() {
  return useQuery({ queryKey: ['billing', 'stripe-subscription'], queryFn: getStripeSubscription })
}
