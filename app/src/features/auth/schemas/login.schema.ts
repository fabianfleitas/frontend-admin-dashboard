import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresá tu correo').email('Correo inválido').max(200),
  password: z.string().min(1, 'Ingresá tu contraseña'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
