import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import type { UserOut } from '@/features/users/types'
import {
  hasInstitutionMembership,
  isInstitutionAdmin,
  isPlatformAdmin,
  isStaffMember,
} from '@/lib/roles'

export interface AuthCapabilities {
  hasMembership: boolean
  isAdmin: boolean
  isStaff: boolean
  isPlatformAdmin: boolean
}

export function useAuthCapabilities(): AuthCapabilities {
  const profile = useAuthStore((s) => s.profile)

  return useMemo<AuthCapabilities>(
    () => ({
      hasMembership: hasInstitutionMembership(profile),
      isAdmin: isInstitutionAdmin(profile),
      isStaff: isStaffMember(profile),
      isPlatformAdmin: isPlatformAdmin(profile),
    }),
    [profile],
  )
}

export type { UserOut }