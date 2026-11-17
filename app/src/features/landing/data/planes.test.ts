import { describe, expect, it } from 'vitest'
import { AVISO_REFERENCIA, CONDICIONES, MONEDA, PLANES, formatearGuaranies } from './planes'

describe('PLANES', () => {
  it('expone los cinco tramos de la tabla comercial', () => {
    expect(PLANES).toHaveLength(5)
    expect(PLANES.map((p) => p.maxUsuarios)).toEqual([500, 1000, 2500, 5000, 10000])
  })

  it('conserva los precios anuales de referencia', () => {
    expect(PLANES.map((p) => p.precioAnual)).toEqual([
      26000000, 27300000, 31000000, 37200000, 49500000,
    ])
  })

  it('mantiene límites y precios crecientes', () => {
    for (let i = 1; i < PLANES.length; i += 1) {
      expect(PLANES[i].maxUsuarios).toBeGreaterThan(PLANES[i - 1].maxUsuarios)
      expect(PLANES[i].precioAnual).toBeGreaterThan(PLANES[i - 1].precioAnual)
    }
  })

  it('usa identificadores únicos y límites dentro del rango publicado', () => {
    const ids = PLANES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PLANES) {
      expect(p.maxUsuarios).toBeGreaterThanOrEqual(500)
      expect(p.maxUsuarios).toBeLessThanOrEqual(10000)
      expect(p.precioAnual).toBeGreaterThan(0)
    }
  })
})

describe('CONDICIONES', () => {
  it('cubre implementación, integración y consumo adicional de IA', () => {
    expect(CONDICIONES.map((c) => c.id)).toEqual(['implementacion', 'integracion', 'consumo-ia'])
  })

  it('conserva los montos de referencia', () => {
    expect(CONDICIONES.map((c) => c.monto)).toEqual([16000000, 8000000, 1000000])
  })

  it('aclara que la unidad del consumo de IA se acuerda por contrato', () => {
    const consumoIa = CONDICIONES.find((c) => c.id === 'consumo-ia')
    expect(consumoIa?.nota).toMatch(/acordan por contrato/i)
  })
})

describe('formatearGuaranies', () => {
  it('usa guaraníes con separador de miles', () => {
    expect(formatearGuaranies(26000000)).toBe('Gs. 26.000.000')
    expect(formatearGuaranies(1000000)).toBe('Gs. 1.000.000')
    expect(MONEDA).toBe('Gs.')
  })
})

describe('aviso de referencia', () => {
  it('desvincula los importes de un precio de mercado firme', () => {
    expect(AVISO_REFERENCIA).toMatch(/valores de referencia/i)
    expect(AVISO_REFERENCIA).toMatch(/no constituyen precios de mercado/i)
  })
})
