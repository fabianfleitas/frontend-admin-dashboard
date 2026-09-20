import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelSubscription } from '../api/billing.service'
import type { SubscriptionCancelIn } from '../types'
import { toast } from '@/stores/toast.store'

export function useCancelSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body?: SubscriptionCancelIn) => cancelSubscription(body),
    onSuccess: () => {
      toast.success('Suscripción cancelada', 'Se cancelará al final del período.')
      qc.invalidateQueries({ queryKey: ['billing', 'stripe-subscription'] })
      qc.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (e: any) => toast.error('Error al cancelar', e?.detail ?? 'Intenta de nuevo.'),
  })
}
