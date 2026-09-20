import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInstitution, updateInstitution, deactivateInstitution } from '../api/platform.service'
import type { InstitutionIn } from '../types'

export function useCreateInstitution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: InstitutionIn) => createInstitution(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institutions'] }),
  })
}

export function useUpdateInstitution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InstitutionIn }) => updateInstitution(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institutions'] }),
  })
}

export function useDeleteInstitution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deactivateInstitution(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institutions'] }),
  })
}