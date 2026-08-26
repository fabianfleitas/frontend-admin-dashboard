import { useQuery } from '@tanstack/react-query'
import { listInstitutions } from '../api/platform.service'

export function usePlatformInstitutions(query?: { activo?: boolean }) {
  return useQuery({ queryKey: ['platform', 'institutions', query], queryFn: () => listInstitutions(query) })
}
