import { z } from 'zod'

export const categorySchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio.')
    .max(200, 'El nombre no puede superar 200 caracteres.'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres.').optional().or(z.literal('')),
})

export type CategoryFormValues = z.input<typeof categorySchema>
export type CategoryFormResolved = z.output<typeof categorySchema>