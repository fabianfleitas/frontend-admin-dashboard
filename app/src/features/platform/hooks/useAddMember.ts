import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMember } from '../api/platform.service'
import type { MemberIn, AuthContext } from '../types'

export function useAddMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ institutionId, payload, auth }: { institutionId: number; payload: MemberIn; auth: AuthContext }) => addMember(institutionId, payload, auth),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'institution'] }),
  })
}
