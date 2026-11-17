import { describe, expect, it } from 'vitest'
import { solicitudAccesoSchema, toSolicitudPayload } from './solicitud.schema'

const VALIDO = {
  institucion_nombre: 'Universidad Ejemplo',
  persona_contacto: 'Ana Pérez',
  email: 'ana@ejemplo.edu.py',
  telefono: '+595981000000',
  cantidad_usuarios_estimada: '1200',
  perfil_solicitado: 'ADMINISTRACION',
  mensaje: 'Necesitamos habilitar el panel.',
  consentimiento: true as const,
  empresa: '',
}

function parse(over: Partial<typeof VALIDO> = {}) {
  return solicitudAccesoSchema.safeParse({ ...VALIDO, ...over })
}

describe('solicitudAccesoSchema', () => {
  it('acepta una solicitud completa', () => {
    expect(parse().success).toBe(true)
  })

  it('exige consentimiento', () => {
    const r = solicitudAccesoSchema.safeParse({ ...VALIDO, consentimiento: false })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.includes('consentimiento'))).toBe(true)
    }
  })

  it('rechaza correos inválidos', () => {
    expect(parse({ email: 'no-es-un-correo' }).success).toBe(false)
    expect(parse({ email: 'a@b' }).success).toBe(false)
  })

  it('rechaza institución y contacto demasiado cortos', () => {
    expect(parse({ institucion_nombre: 'X' }).success).toBe(false)
    expect(parse({ persona_contacto: '' }).success).toBe(false)
  })

  it('permite los campos opcionales vacíos', () => {
    const r = parse({
      telefono: '',
      cantidad_usuarios_estimada: '',
      perfil_solicitado: '',
      mensaje: '',
    })
    expect(r.success).toBe(true)
  })

  it('rechaza una cantidad de usuarios no numérica o fuera de rango', () => {
    expect(parse({ cantidad_usuarios_estimada: 'muchos' }).success).toBe(false)
    expect(parse({ cantidad_usuarios_estimada: '0' }).success).toBe(false)
  })

  it('rechaza un perfil desconocido', () => {
    expect(parse({ perfil_solicitado: 'OTRO' }).success).toBe(false)
    expect(parse({ perfil_solicitado: '' }).success).toBe(true)
  })
})

describe('toSolicitudPayload', () => {
  it('convierte la cantidad a número y normaliza los vacíos a null', () => {
    const values = solicitudAccesoSchema.parse(VALIDO)
    const payload = toSolicitudPayload(values)

    expect(payload.cantidad_usuarios_estimada).toBe(1200)
    expect(payload.institucion_nombre).toBe('Universidad Ejemplo')
    expect(payload.consentimiento).toBe(true)
    expect(payload.empresa).toBe('')
  })

  it('deja null los opcionales vacíos', () => {
    const values = solicitudAccesoSchema.parse({
      ...VALIDO,
      telefono: '',
      cantidad_usuarios_estimada: '',
      perfil_solicitado: '',
      mensaje: '',
    })
    const payload = toSolicitudPayload(values)

    expect(payload.telefono).toBeNull()
    expect(payload.cantidad_usuarios_estimada).toBeNull()
    expect(payload.perfil_solicitado).toBeNull()
    expect(payload.mensaje).toBeNull()
  })
})
