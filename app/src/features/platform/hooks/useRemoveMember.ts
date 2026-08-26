import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeMember } from '../api/platform.service'

export function useRemoveMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ institutionId, memberId }: { institutionId: number; memberId: number }) => removeMember(institutionId, memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institution'] }),
  })
}
