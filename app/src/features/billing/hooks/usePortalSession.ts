import { useMutation } from '@tanstack/react-query'
import { createPortalSession } from '../api/billing.service'
import type { StripePortalSessionIn } from '../types'

export function usePortalSession() {
  return useMutation({ mutationFn: (body: StripePortalSessionIn) => createPortalSession(body) })
}
