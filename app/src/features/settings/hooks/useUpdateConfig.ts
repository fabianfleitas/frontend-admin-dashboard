import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateConfig } from '../api/settings.service'
import type { ConfigParamIn } from '../types'

export function useUpdateConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ clave, body }: { clave: string; body: ConfigParamIn }) => updateConfig(clave, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['config'] }),
  })
}
