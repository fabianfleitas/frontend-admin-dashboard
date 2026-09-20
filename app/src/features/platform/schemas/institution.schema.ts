import { z } from 'zod'

export const institutionSchema = z.object({
  codigo: z.string().trim().max(20).optional().or(z.literal('')),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  nombre_comercial: z.string().trim().max(120).optional().or(z.literal('')),
  ciudad: z.string().trim().max(80).optional().or(z.literal('')),
  pais: z.string().trim().max(80).optional().or(z.literal('')),
  direccion: z.string().trim().max(200).optional().or(z.literal('')),
  email_contacto: z.string().trim().email('Email inválido').optional().or(z.literal('')),
  telefono_contacto: z.string().trim().max(40).optional().or(z.literal('')),
})

export type InstitutionFormValues = z.infer<typeof institutionSchema>
export type InstitutionFormResolved = z.infer<typeof institutionSchema>