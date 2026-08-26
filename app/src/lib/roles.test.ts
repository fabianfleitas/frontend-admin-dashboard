import { describe, expect, it } from 'vitest'
import {
  hasInstitutionMembership,
  isInstitutionAdmin,
  isPlatformAdmin,
  isStaffMember,
  memberTypeLabel,
} from './roles'
import type { UserOut } from '@/features/users/types'

function makeUser(overrides: Partial<UserOut> = {}): UserOut {
  return {
    external_auth_id: 'auth-1',
    email: 'user@example.com',
    full_name: null,
    role: 'STUDENT',
    institucion_id: null,
    tipo_miembro: null,
    is_platform_admin: false,
    nombre_institucion: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('hasInstitutionMembership', () => {
  it('true cuando tiene institucion_id y tipo_miembro', () => {
    expect(
      hasInstitutionMembership(makeUser({ institucion_id: 1, tipo_miembro: 'ADMIN' })),
    ).toBe(true)
  })

  it('false sin tipo_miembro', () => {
    expect(hasInstitutionMembership(makeUser({ institucion_id: 1 }))).toBe(false)
  })

  it('false sin institucion_id', () => {
    expect(hasInstitutionMembership(makeUser({ tipo_miembro: 'ESTUDIANTE' }))).toBe(false)
  })

  it('false con perfil nulo', () => {
    expect(hasInstitutionMembership(null)).toBe(false)
    expect(hasInstitutionMembership(undefined)).toBe(false)
  })
})

describe('isInstitutionAdmin', () => {
  it('true solo para tipo_miembro ADMIN', () => {
    expect(isInstitutionAdmin(makeUser({ tipo_miembro: 'ADMIN' }))).toBe(true)
    expect(isInstitutionAdmin(makeUser({ tipo_miembro: 'SECRETARIA' }))).toBe(false)
    expect(isInstitutionAdmin(makeUser({ tipo_miembro: 'ESTUDIANTE' }))).toBe(false)
    expect(isInstitutionAdmin(makeUser())).toBe(false)
  })
})

describe('isStaffMember', () => {
  it('true para ADMIN y SECRETARIA', () => {
    expect(isStaffMember(makeUser({ tipo_miembro: 'ADMIN' }))).toBe(true)
    expect(isStaffMember(makeUser({ tipo_miembro: 'SECRETARIA' }))).toBe(true)
  })

  it('false para ESTUDIANTE o sin membresía', () => {
    expect(isStaffMember(makeUser({ tipo_miembro: 'ESTUDIANTE' }))).toBe(false)
    expect(isStaffMember(makeUser())).toBe(false)
  })
})

describe('isPlatformAdmin', () => {
  it('true solo con is_platform_admin', () => {
    expect(isPlatformAdmin(makeUser({ is_platform_admin: true }))).toBe(true)
    expect(isPlatformAdmin(makeUser({ is_platform_admin: false }))).toBe(false)
    expect(isPlatformAdmin(makeUser())).toBe(false)
    expect(isPlatformAdmin(null)).toBe(false)
  })
})

describe('memberTypeLabel', () => {
  it('mapea cada tipo a su etiqueta', () => {
    expect(memberTypeLabel('ADMIN')).toBe('Administrador')
    expect(memberTypeLabel('SECRETARIA')).toBe('Secretaría')
    expect(memberTypeLabel('ESTUDIANTE')).toBe('Estudiante')
  })

  it('devuelve "Sin membresía" para valores vacíos', () => {
    expect(memberTypeLabel(null)).toBe('Sin membresía')
    expect(memberTypeLabel(undefined)).toBe('Sin membresía')
  })
})