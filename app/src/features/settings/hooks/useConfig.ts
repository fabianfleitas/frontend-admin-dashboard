import { useQuery } from '@tanstack/react-query'
import { getConfig } from '../api/settings.service'

export function useConfig() {
  return useQuery({ queryKey: ['config'], queryFn: getConfig })
}
