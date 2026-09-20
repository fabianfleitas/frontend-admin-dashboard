import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMember } from '../api/platform.service'
import type { MemberIn } from '../types'

export function useAddMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ institutionId, payload }: { institutionId: number; payload: MemberIn }) => addMember(institutionId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institution'] }),
  })
}
