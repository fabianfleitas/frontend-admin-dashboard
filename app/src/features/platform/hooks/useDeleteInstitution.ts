import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateInstitution } from '../api/platform.service'

export function useDeleteInstitution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deactivateInstitution(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institutions'] }),
  })
}