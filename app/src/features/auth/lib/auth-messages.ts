/**
 * Traduce los errores de Supabase Auth a mensajes en español para la UI.
 *
 * Es una función pura para poder testearla sin red. Ante un error desconocido
 * devuelve un mensaje genérico: nunca exponemos el texto crudo del proveedor.
 */
export interface AuthErrorLike {
  message?: string
  code?: string
  status?: number
}

const GENERIC_MESSAGE = 'No pudimos iniciar sesión. Intentá de nuevo en unos minutos.'

export function mapAuthError(error: AuthErrorLike | null | undefined): string {
  if (!error) return GENERIC_MESSAGE

  const message = error.message ?? ''
  const code = error.code ?? ''
  const combined = `${message} ${code}`.toLowerCase()

  if (
    combined.includes('invalid login credentials') ||
    combined.includes('invalid_credentials')
  ) {
    return 'Correo o contraseña incorrectos.'
  }

  if (combined.includes('email not confirmed') || combined.includes('email_not_confirmed')) {
    return 'Debés confirmar tu correo antes de iniciar sesión.'
  }

  if (
    error.status === 429 ||
    combined.includes('too many requests') ||
    combined.includes('rate limit') ||
    combined.includes('over_request_rate_limit')
  ) {
    return 'Demasiados intentos. Esperá un momento e intentá de nuevo.'
  }

  return GENERIC_MESSAGE
}
