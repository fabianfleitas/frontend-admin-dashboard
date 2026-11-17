import { z } from 'zod'

export const PERFILES_SOLICITADOS = [
  { value: 'ADMINISTRACION', label: 'Administración institucional' },
  { value: 'SECRETARIA', label: 'Secretaría' },
  { value: 'ESTUDIANTE', label: 'Estudiantes' },
  { value: 'A_CONFIRMAR', label: 'Todavía no lo sé' },
] as const

const PERFIL_VALUES = PERFILES_SOLICITADOS.map((p) => p.value) as [string, ...string[]]

export const solicitudAccesoSchema = z.object({
  institucion_nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá el nombre de la institución')
    .max(160, 'Máximo 160 caracteres'),
  persona_contacto: z
    .string()
    .trim()
    .min(2, 'Ingresá el nombre de la persona de contacto')
    .max(120, 'Máximo 120 caracteres'),
  email: z.string().trim().min(1, 'Ingresá un correo').email('Correo inválido').max(200),
  telefono: z.string().trim().max(40, 'Máximo 40 caracteres').optional().or(z.literal('')),
  cantidad_usuarios_estimada: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (v) => !v || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 1_000_000),
      'Ingresá un número entre 1 y 1.000.000',
    ),
  perfil_solicitado: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || PERFIL_VALUES.includes(v), 'Perfil inválido'),
  mensaje: z.string().trim().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
  consentimiento: z
    .boolean()
    .refine((v) => v === true, 'Necesitamos tu consentimiento para tratar los datos'),
  empresa: z.string().max(200).optional().or(z.literal('')),
})

export type SolicitudAccesoFormValues = z.infer<typeof solicitudAccesoSchema>

export interface SolicitudAccesoPayload {
  institucion_nombre: string
  persona_contacto: string
  email: string
  telefono: string | null
  cantidad_usuarios_estimada: number | null
  perfil_solicitado: string | null
  mensaje: string | null
  consentimiento: true
  empresa: string
}

export function toSolicitudPayload(values: SolicitudAccesoFormValues): SolicitudAccesoPayload {
  const cantidad = values.cantidad_usuarios_estimada?.trim()
  return {
    institucion_nombre: values.institucion_nombre.trim(),
    persona_contacto: values.persona_contacto.trim(),
    email: values.email.trim(),
    telefono: values.telefono?.trim() || null,
    cantidad_usuarios_estimada: cantidad ? Number(cantidad) : null,
    perfil_solicitado: values.perfil_solicitado?.trim() || null,
    mensaje: values.mensaje?.trim() || null,
    consentimiento: true,
    empresa: values.empresa ?? '',
  }
}
