import { useMutation } from '@tanstack/react-query'
import { changePlan } from '../api/billing.service'
import type { SubscriptionChangePlanIn } from '../types'

export function useChangePlan() {
  return useMutation({ mutationFn: (body: SubscriptionChangePlanIn) => changePlan(body) })
}
