import { describe, expect, it } from 'vitest'
import { parseAuthFlag } from './auth-methods'

describe('parseAuthFlag', () => {
  it('usa el fallback cuando el valor es undefined o vacío', () => {
    expect(parseAuthFlag(undefined, true)).toBe(true)
    expect(parseAuthFlag(undefined, false)).toBe(false)
    expect(parseAuthFlag('', true)).toBe(true)
    expect(parseAuthFlag('   ', false)).toBe(false)
  })

  it('activa solo con "true" (case-insensitive)', () => {
    expect(parseAuthFlag('true', false)).toBe(true)
    expect(parseAuthFlag('TRUE', false)).toBe(true)
    expect(parseAuthFlag(' True ', false)).toBe(true)
  })

  it('desactiva con cualquier otro valor', () => {
    expect(parseAuthFlag('false', true)).toBe(false)
    expect(parseAuthFlag('1', true)).toBe(false)
    expect(parseAuthFlag('yes', true)).toBe(false)
  })
})
