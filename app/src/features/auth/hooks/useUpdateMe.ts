import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMe } from '../api/auth.service'
import { toast } from '@/stores/toast.store'

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { full_name?: string | null }) => updateMe(body),
    onSuccess: (user) => {
      qc.setQueryData(['me'], user)
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Perfil actualizado.')
    },
    onError: () => {
      toast.error('No fue posible actualizar el perfil.')
    },
  })
}