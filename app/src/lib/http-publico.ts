// Ruta duplicada a propósito: importar `API_URL` desde `lib/http.ts` arrastraría
// supabase y el auth store al chunk de entrada, que no los necesita.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(message: string, status: number, detail?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export interface PublicRequestOptions {
  body?: unknown
}

/**
 * Cliente para endpoints públicos, sin credenciales.
 *
 * No reusa `lib/http.ts` a propósito: ese cliente exige token y lanza
 * `SessionMissingError`, y además cierra la sesión ante ciertos `401`. Ninguna
 * de esas dos cosas corresponde a un formulario que se usa sin iniciar sesión.
 */
export async function postPublico<T>(path: string, options: PublicRequestOptions = {}): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const body = options.body === undefined ? undefined : JSON.stringify(options.body)

  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body })

  if (!res.ok) {
    let detail: unknown
    try {
      detail = await res.json()
    } catch {
      detail = await res.text().catch(() => undefined)
    }
    throw new ApiError(`API ${res.status} en ${path}`, res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/**
 * Extrae los mensajes de error por campo de un `422` de FastAPI
 * (`detail: [{ loc: ['body', 'email'], msg: '...' }]`).
 */
export function erroresDeCampo(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {}
  const detail = error.detail as { detail?: unknown } | undefined
  const items = (detail as { detail?: unknown } | undefined)?.detail
  if (!Array.isArray(items)) return {}

  const salida: Record<string, string> = {}
  for (const item of items as Array<{ loc?: unknown[]; msg?: string }>) {
    const loc = Array.isArray(item.loc) ? item.loc : []
    const campo = loc[loc.length - 1]
    if (typeof campo === 'string' && typeof item.msg === 'string' && !salida[campo]) {
      salida[campo] = item.msg
    }
  }
  return salida
}
