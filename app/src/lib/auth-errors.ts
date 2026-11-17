/**
 * Clasificación de 401 para NO cerrar sesión ante fallos transitorios.
 *
 * El backend (`backend-agent-system/app/core/security.py`) responde 401 tanto
 * cuando la sesión realmente murió como cuando falló su verificación del JWT
 * por red (Supabase inaccesible, timeout, rate limit). Solo el primer caso
 * justifies un `signOut()`.
 */

/** `detail` que el backend emite cuando la sesión ya no es recuperable. */
const SESSION_FATAL_DETAILS = [
  'Missing Authorization header',
  'Invalid Authorization format',
  'Invalid or expired JWT',
  'Inactive user',
] as const

/**
 * `detail` de un 401 cuando el backend no pudo *comprobar* el token por un
 * fallo de red hacia Supabase. La sesión del usuario sigue viva.
 */
const TRANSIENT_MARKER = 'JWT verification failed'

export type UnauthorizedVerdict = 'session_fatal' | 'transient'

export class SessionMissingError extends Error {
  constructor(message = 'No hay sesión de Supabase disponible para esta petición.') {
    super(message)
    this.name = 'SessionMissingError'
  }
}

/**
 * Extrae el texto de `detail` de un error de FastAPI. A veces llega como
 * string plano y a veces envuelto en `{"detail": "..."}` o `{"message": "..."}`.
 */
export function extractDetailText(detail: unknown): string {
  if (typeof detail === 'string') return detail
  if (typeof detail !== 'object' || detail === null) return ''
  const record = detail as Record<string, unknown>
  for (const key of ['detail', 'message'] as const) {
    const value = record[key]
    if (typeof value === 'string') return value
  }
  return ''
}

/**
 * Decide si un 401 debe cerrar la sesión.
 *
 * Fail-safe deliberado: ante un `detail` desconocido se asume `transient`.
 * Cerrar la sesión es destructivo (signOut + redirect) y preferimos dejar al
 * usuario en la app con un error visible antes que expulsarlo por un 401 que
 * no sabemos interpretar.
 */
export function classifyUnauthorized(detail: unknown): UnauthorizedVerdict {
  const text = extractDetailText(detail)
  if (!text) return 'transient'
  if (text.includes(TRANSIENT_MARKER)) return 'transient'
  return SESSION_FATAL_DETAILS.some((fatal) => text.includes(fatal)) ? 'session_fatal' : 'transient'
}