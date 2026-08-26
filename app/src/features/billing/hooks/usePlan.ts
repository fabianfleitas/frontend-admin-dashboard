import { useQuery } from '@tanstack/react-query'
import { getPlan, getSubscription } from '../api/billing.service'

export function usePlan() {
  return useQuery({ queryKey: ['plan'], queryFn: getPlan })
}

export function useSubscription() {
  return useQuery({ queryKey: ['subscription'], queryFn: getSubscription })
}
