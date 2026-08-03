import { z } from 'zod'

export const uploadDocumentSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es obligatorio.')
    .max(200, 'El título no puede superar 200 caracteres.'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres.').optional().or(z.literal('')),
  categoria_id: z.number().int().positive().optional().nullable(),
  codigo_documento: z.string().max(50, 'Máximo 50 caracteres.').optional().nullable(),
  file: z.instanceof(File, { message: 'Debe seleccionar un archivo PDF.' }),
})

export type UploadDocumentValues = z.input<typeof uploadDocumentSchema>
export type UploadDocumentResolved = z.output<typeof uploadDocumentSchema>