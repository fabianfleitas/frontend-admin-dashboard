import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivatePlan } from '../api/platform.service'

export function useDeletePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deactivatePlan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'plans'] }),
  })
}