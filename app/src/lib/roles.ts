import type { MemberType, UserOut } from '@/features/users/types'

/**
 * Helpers de permisos de UI basados en el modelo de identidad actual del backend.
 * `GET /me` es la fuente de verdad: usa `tipo_miembro` para permisos institucionales,
 * `is_platform_admin` para permisos de plataforma y trata `role` como legacy.
 */

export type { MemberType }

/** El usuario tiene una membresía institucional activa (institución + tipo de miembro). */
export function hasInstitutionMembership(user: Pick<UserOut, 'institucion_id' | 'tipo_miembro'> | null | undefined): boolean {
  return Boolean(user && user.institucion_id != null && user.tipo_miembro != null)
}

/** Miembro institucional con rol `ADMIN`. */
export function isInstitutionAdmin(user: Pick<UserOut, 'tipo_miembro'> | null | undefined): boolean {
  return user?.tipo_miembro === 'ADMIN'
}

/** Personal institucional con acceso a gestión documental/analytics/audit (ADMIN o SECRETARIA). */
export function isStaffMember(user: Pick<UserOut, 'tipo_miembro'> | null | undefined): boolean {
  return user?.tipo_miembro === 'ADMIN' || user?.tipo_miembro === 'SECRETARIA'
}

/** Administrador de plataforma (superadmin). */
export function isPlatformAdmin(user: Pick<UserOut, 'is_platform_admin'> | null | undefined): boolean {
  return Boolean(user?.is_platform_admin)
}

export function memberTypeLabel(type: MemberType | null | undefined): string {
  switch (type) {
    case 'ADMIN':
      return 'Administrador'
    case 'SECRETARIA':
      return 'Secretaría'
    case 'ESTUDIANTE':
      return 'Estudiante'
    default:
      return 'Sin membresía'
  }
}
