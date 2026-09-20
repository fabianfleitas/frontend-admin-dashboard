import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendTestNotification, updateSmtpConfig } from '../api/settings.service'
import type { SendTestIn, SmtpConfigIn } from '../types'

export function useUpdateSmtpConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: SmtpConfigIn) => updateSmtpConfig(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['smtp'] }),
  })
}

export function useSendTestNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: SendTestIn) => sendTestNotification(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}