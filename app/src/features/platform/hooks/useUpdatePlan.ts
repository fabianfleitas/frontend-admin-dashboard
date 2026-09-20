import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlan } from '../api/platform.service'
import type { PlanIn } from '../types'

export function useUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PlanIn }) => updatePlan(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'plans'] }),
  })
}