import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reactivateSubscription } from '../api/billing.service'
import { toast } from '@/stores/toast.store'

export function useReactivateSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => reactivateSubscription(),
    onSuccess: () => {
      toast.success('Suscripción reactivada')
      qc.invalidateQueries({ queryKey: ['billing', 'stripe-subscription'] })
      qc.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (e: any) => toast.error('Error al reactivar', e?.detail ?? 'Intenta de nuevo.'),
  })
}
