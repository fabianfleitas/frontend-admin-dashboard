import { describe, expect, it } from 'vitest'
import { mailtoPropuesta } from './contacto'

describe('mailtoPropuesta', () => {
  it('devuelve null si no hay correo de contacto configurado', () => {
    expect(mailtoPropuesta('')).toBeNull()
    expect(mailtoPropuesta('   ')).toBeNull()
  })

  it('arma el enlace con asunto y cuerpo precargados', () => {
    const mailto = mailtoPropuesta('  ventas@ejemplo.py  ')
    expect(mailto).not.toBeNull()
    expect(mailto).toContain('mailto:ventas@ejemplo.py')
    expect(mailto).toContain('subject=Solicitud%20de%20propuesta%20para%20Voxia')
    expect(mailto).toContain('body=')
  })

  it('precarga institución, usuarios, documentación e integraciones', () => {
    const mailto = mailtoPropuesta('ventas@ejemplo.py') ?? ''
    const cuerpo = decodeURIComponent(mailto.split('body=')[1] ?? '')
    expect(cuerpo).toContain('Institución:')
    expect(cuerpo).toContain('Cantidad estimada de usuarios:')
    expect(cuerpo).toContain('Documentación a cargar:')
    expect(cuerpo).toContain('Integraciones requeridas:')
  })
})
