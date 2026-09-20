import { useMutation } from '@tanstack/react-query'
import { createCheckoutSession } from '../api/billing.service'
import type { CheckoutSessionIn } from '../types'

export function useCheckoutSession() {
  return useMutation({ mutationFn: (body: CheckoutSessionIn) => createCheckoutSession(body) })
}
