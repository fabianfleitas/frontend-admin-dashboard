import { useQuery } from '@tanstack/react-query'
import { listPlans } from '../api/billing.service'

export function usePlans() {
  return useQuery({ queryKey: ['plans'], queryFn: listPlans })
}