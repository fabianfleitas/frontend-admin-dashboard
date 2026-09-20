import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncPlanWithStripe } from '../api/billing.service'
import type { StripePlanSyncIn } from '../types'
import { toast } from '@/stores/toast.store'

export function useSyncPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: StripePlanSyncIn) => syncPlanWithStripe(body),
    onSuccess: () => {
      toast.success('Plan sincronizado con Stripe')
      qc.invalidateQueries({ queryKey: ['plan'] })
    },
    onError: (e: any) => toast.error('Error al sincronizar', e?.detail ?? 'Intenta de nuevo.'),
  })
}
