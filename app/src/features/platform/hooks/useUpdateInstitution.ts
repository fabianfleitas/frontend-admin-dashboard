import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInstitution } from '../api/platform.service'
import type { InstitutionIn } from '../types'

export function useUpdateInstitution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InstitutionIn }) => updateInstitution(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institutions'] }),
  })
}