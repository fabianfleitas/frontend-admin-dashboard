import { useQuery } from '@tanstack/react-query'
import { getSmtpConfig, listNotifications } from '../api/settings.service'

export function useSmtpConfig() {
  return useQuery({ queryKey: ['smtp'], queryFn: getSmtpConfig })
}

export function useNotifications(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => listNotifications(params),
  })
}