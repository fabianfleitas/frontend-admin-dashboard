import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlan, updatePlan, deactivatePlan } from '../api/platform.service'
import type { PlanIn } from '../types'

export function useCreatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PlanIn) => createPlan(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'plans'] }),
  })
}

export function useUpdatePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PlanIn }) => updatePlan(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'plans'] }),
  })
}

export function useDeletePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deactivatePlan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'plans'] }),
  })
}