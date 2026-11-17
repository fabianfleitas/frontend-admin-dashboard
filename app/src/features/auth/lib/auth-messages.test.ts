import { describe, expect, it } from 'vitest'
import { mapAuthError } from './auth-messages'

describe('mapAuthError', () => {
  it('traduce credenciales inválidas', () => {
    expect(mapAuthError({ message: 'Invalid login credentials' })).toBe(
      'Correo o contraseña incorrectos.',
    )
    expect(mapAuthError({ message: '', code: 'invalid_credentials' })).toBe(
      'Correo o contraseña incorrectos.',
    )
  })

  it('traduce correo sin confirmar', () => {
    expect(mapAuthError({ message: 'Email not confirmed' })).toBe(
      'Debés confirmar tu correo antes de iniciar sesión.',
    )
  })

  it('traduce el rate limit por status o mensaje', () => {
    expect(mapAuthError({ status: 429 })).toContain('Demasiados intentos')
    expect(mapAuthError({ message: 'Too many requests' })).toContain('Demasiados intentos')
    expect(mapAuthError({ code: 'over_request_rate_limit' })).toContain('Demasiados intentos')
  })

  it('usa un mensaje genérico ante errores desconocidos o ausentes', () => {
    const generico = 'No pudimos iniciar sesión. Intentá de nuevo en unos minutos.'
    expect(mapAuthError({ message: 'Something exploded' })).toBe(generico)
    expect(mapAuthError(null)).toBe(generico)
    expect(mapAuthError(undefined)).toBe(generico)
  })
})
