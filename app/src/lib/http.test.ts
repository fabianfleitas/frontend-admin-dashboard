import { describe, expect, it } from 'vitest'
import { ApiError, isNotFound } from './http'

describe('isNotFound', () => {
  it('true solo para ApiError con status 404', () => {
    expect(isNotFound(new ApiError('API 404 en /x', 404))).toBe(true)
  })

  it('false para otros status de ApiError', () => {
    expect(isNotFound(new ApiError('API 403 en /x', 403))).toBe(false)
    expect(isNotFound(new ApiError('API 500 en /x', 500))).toBe(false)
  })

  it('false para errores que no son ApiError', () => {
    expect(isNotFound(new Error('cualquier error'))).toBe(false)
    expect(isNotFound(undefined)).toBe(false)
    expect(isNotFound(null)).toBe(false)
  })
})