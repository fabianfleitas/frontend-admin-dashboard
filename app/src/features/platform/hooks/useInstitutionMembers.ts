import { useQuery } from '@tanstack/react-query'
import { listMembers } from '../api/platform.service'

export function useInstitutionMembers(id: number | null) {
  return useQuery({
    queryKey: ['platform', 'institution', id, 'members'],
    queryFn: () => (id ? listMembers(id) : []),
    enabled: !!id,
  })
}
