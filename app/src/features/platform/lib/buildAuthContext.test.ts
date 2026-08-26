import { describe, expect, it } from 'vitest'
import { buildAuthContext } from './buildAuthContext'
import type { UserOut } from '@/features/users/types'

describe('buildAuthContext', () => {
  it('mapea UserOut a AuthContext', () => {
    const user: UserOut = {
      external_auth_id: 'auth-1',
      email: 'u@i.edu',
      full_name: 'Ana',
      role: 'STUDENT',
      institucion_id: 42,
      tipo_miembro: 'ADMIN',
      is_platform_admin: true,
      nombre_institucion: 'Inst A',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    }
    const ctx = buildAuthContext(user)
    expect(ctx.external_auth_id).toBe('auth-1')
    expect(ctx.institucion_id).toBe(42)
    expect(ctx.tipo_miembro).toBe('ADMIN')
    expect(ctx.is_platform_admin).toBe(true)
    expect(ctx.auth_provider).toBe('google')
  })
})
