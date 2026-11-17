import { describe, expect, it } from 'vitest'
import { classifyUnauthorized, extractDetailText, SessionMissingError } from './auth-errors'

/**
 * Los literales replicados de `backend-agent-system/app/core/security.py`.
 * Si el backend cambia sus `detail`, estos tests avisan.
 */
describe('extractDetailText', () => {
  it('devuelve el string tal cual', () => {
    expect(extractDetailText('Inactive user')).toBe('Inactive user')
  })

  it('desenvuelve la forma { detail }', () => {
    expect(extractDetailText({ detail: 'Invalid or expired JWT' })).toBe('Invalid or expired JWT')
  })

  it('desenvuelve la forma { message }', () => {
    expect(extractDetailText({ message: 'Inactive user' })).toBe('Inactive user')
  })

  it('devuelve string vacío para valores no textuales', () => {
    expect(extractDetailText(null)).toBe('')
    expect(extractDetailText(undefined)).toBe('')
    expect(extractDetailText(42)).toBe('')
    expect(extractDetailText({ detail: { anidado: true } })).toBe('')
  })
})

describe('classifyUnauthorized', () => {
  it('session_fatal: la sesión ya no es recuperable', () => {
    expect(classifyUnauthorized('Missing Authorization header (expected Bearer <jwt>)')).toBe(
      'session_fatal',
    )
    expect(classifyUnauthorized('Invalid Authorization format (expected Bearer <jwt>)')).toBe(
      'session_fatal',
    )
    expect(classifyUnauthorized('Invalid or expired JWT')).toBe('session_fatal')
    expect(classifyUnauthorized('Inactive user')).toBe('session_fatal')
  })

  it('session_fatal: funciona también con la forma envuelta', () => {
    expect(classifyUnauthorized({ detail: 'Inactive user' })).toBe('session_fatal')
  })

  it('transient: el backend no pudo verificar el JWT por red', () => {
    expect(
      classifyUnauthorized("JWT verification failed: ConnectionError('HTTPSConnectionPool')"),
    ).toBe('transient')
  })

  it('transient: ante un detail desconocido se conserva la sesión', () => {
    expect(classifyUnauthorized('algo que el backend aún no emite')).toBe('transient')
    expect(classifyUnauthorized('')).toBe('transient')
    expect(classifyUnauthorized(null)).toBe('transient')
  })
})

describe('SessionMissingError', () => {
  it('es un Error con nombre propio', () => {
    const error = new SessionMissingError()
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('SessionMissingError')
    expect(error.message).toContain('sesión')
  })
})