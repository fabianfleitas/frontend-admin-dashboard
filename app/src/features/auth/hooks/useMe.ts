import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import {
  hasInstitutionMembership,
  isInstitutionAdmin,
  isPlatformAdmin,
  isStaffMember,
} from '@/lib/roles'
import type { MemberType, UserRole } from '@/features/users/types'

export function useMe() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)

  const isAuthenticated = Boolean(user)

  const query = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.data) setProfile(query.data)
  }, [query.data, setProfile])

  const effective = profile ?? query.data
  const isLoading = isAuthenticated && !effective && !query.isError

  return {
    user,
    profile,
    role: effective?.role as UserRole | undefined,
    memberType: effective?.tipo_miembro as MemberType | null | undefined,
    isPlatformAdmin: isPlatformAdmin(effective),
    hasMembership: hasInstitutionMembership(effective),
    isAdmin: isInstitutionAdmin(effective),
    isStaff: isStaffMember(effective),
    institucionId: effective?.institucion_id ?? null,
    fullName: effective?.full_name ?? null,
    institucionNombre: effective?.nombre_institucion ?? null,
    email: effective?.email ?? null,
    isLoading,
    isError: query.isError,
  }
}