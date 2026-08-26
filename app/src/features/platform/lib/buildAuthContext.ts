import type { UserOut } from '@/features/users/types'
import type { AuthContext } from '../types'

export function buildAuthContext(profile: UserOut): AuthContext {
  return {
    external_auth_id: profile.external_auth_id,
    email: profile.email ?? '',
    full_name: profile.full_name ?? '',
    institucion_id: profile.institucion_id ?? null,
    tipo_miembro: profile.tipo_miembro ?? 'ESTUDIANTE',
    is_platform_admin: profile.is_platform_admin ?? false,
    auth_provider: 'google',
  }
}
