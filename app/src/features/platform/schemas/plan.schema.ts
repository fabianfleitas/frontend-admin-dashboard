import { z } from 'zod'

export const planSchema = z.object({
  codigo: z.string().trim().max(20).optional().or(z.literal('')),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  descripcion: z.string().trim().max(300).optional().or(z.literal('')),
  precio: z.string().optional().or(z.literal('')),
  moneda: z.string().trim().max(8).optional().or(z.literal('')),
  intervalo: z.string().trim().max(20).optional().or(z.literal('')),
  max_documentos: z.string().optional().or(z.literal('')),
  max_usuarios: z.string().optional().or(z.literal('')),
  max_estudiantes: z.string().optional().or(z.literal('')),
})

export type PlanFormValues = z.infer<typeof planSchema>
export type PlanFormResolved = z.infer<typeof planSchema>

export function toPlanIn(values: PlanFormResolved): {
  codigo: string | null
  nombre: string
  descripcion: string | null
  precio: number | null
  moneda: string | null
  intervalo: string | null
  max_documentos: number | null
  max_usuarios: number | null
  max_estudiantes: number | null
} {
  const toNum = (v: string | undefined): number | null => {
    if (!v || !v.trim()) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return {
    codigo: values.codigo?.trim() || null,
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || null,
    precio: toNum(values.precio),
    moneda: values.moneda?.trim() || null,
    intervalo: values.intervalo?.trim() || null,
    max_documentos: toNum(values.max_documentos),
    max_usuarios: toNum(values.max_usuarios),
    max_estudiantes: toNum(values.max_estudiantes),
  }
}