import { supabase } from './supabase'
import {
  classifyUnauthorized,
  SessionMissingError,
  type UnauthorizedVerdict,
} from '@/lib/auth-errors'
import { useAuthStore } from '@/stores/auth.store'

export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

if (!API_URL) {
  console.warn('[http] VITE_API_URL no está configurada en el entorno.')
}

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

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
  multipart?: boolean
  /** Resolve the response as a Blob instead of JSON (e.g. audio). */
  responseType?: 'blob'
}

/**
 * Lee el access token **solo** desde storage.
 *
 * No usar `supabase.auth.getUser()` como gate: es un round-trip de red a
 * Supabase por request y, si falla transitoriamente, devolvía `null` y el
 * request salía sin `Authorization` -> 401 -> cierre de sesión. `getSession()`
 * lee storage y solo va a red cuando el token entra en la ventana de refresh
 * (90s), y en ese caso refresca antes de devolver.
 */
async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) {
    console.warn('[auth] getSession() devolvió error:', error.message)
    return null
  }
  return session?.access_token ?? null
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(API_URL + path)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function parseErrorBody(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return await res.text().catch(() => undefined)
  }
}

/**
 * Cierra la sesión y manda a /login. Idempotente: varias respuestas 401
 * concurrentes comparten la misma promesa en lugar de duplicar el signOut.
 */
let signOutInFlight: Promise<void> | null = null

function terminateSession(): Promise<void> {
  if (signOutInFlight) return signOutInFlight
  signOutInFlight = (async () => {
    try {
      useAuthStore.getState().setUser(null)
      await supabase.auth.signOut()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    } finally {
      signOutInFlight = null
    }
  })()
  return signOutInFlight
}

/**
 * Un 401 transitorio (el backend no pudo verificar el JWT por red) no cierra la
 * sesión: solo lo propaga para que la UI muestre ErrorState y React Query
 * reintente. Cerrar sesión aquí expulsaba al usuario por un fallo de Supabase.
 */
/** Edad del access token en ms, si se puede derivar del JWT. */
function tokenAgeMs(token: string | null): number | null {
  if (!token) return null
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const claims = JSON.parse(atob(payload)) as { iat?: number }
    return typeof claims.iat === 'number' ? Date.now() - claims.iat * 1000 : null
  } catch {
    return null
  }
}

function handleUnauthorized(
  path: string,
  detail: unknown,
  hadAuthHeader: boolean,
  token: string | null,
) {
  const verdict: UnauthorizedVerdict = classifyUnauthorized(detail)
  console.warn('[auth] 401 en', path, {
    verdict,
    hadAuthHeader,
    detail,
    tokenAgeMs: tokenAgeMs(token),
  })
  if (verdict === 'session_fatal') {
    void terminateSession()
  }
}

async function send(url: string, init: RequestInit, token: string | null): Promise<Response> {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body: dataBody, query, headers, multipart, responseType, ...rest } = options

  const initHeaders = new Headers(headers)

  let finalBody: BodyInit | undefined
  if (dataBody !== undefined) {
    if (multipart) {
      if (!(dataBody instanceof FormData)) {
        throw new Error('multipart request body must be a FormData instance')
      }
      finalBody = dataBody
    } else {
      initHeaders.set('Content-Type', 'application/json')
      finalBody = JSON.stringify(dataBody)
    }
  }

  const token = await getAccessToken()
  // Nunca enviar un request sin credenciales: el backend respondería 401 y el
  // ciclo de cierre de sesión empezaría por un fallo que no es del usuario.
  if (!token) {
    useAuthStore.getState().setUser(null)
    throw new SessionMissingError()
  }

  const url = buildUrl(path, query)
  const init: RequestInit = { ...rest, headers: initHeaders, body: finalBody }

  let res = await send(url, init, token)

  if (res.status === 401) {
    let detail = await parseErrorBody(res)

    // Reintento único: si el token cambió entre el envío original y ahora, la
    // sesión se refrescó en vuelo y el 401 era por el token viejo. Solo se
    // reintenta cuando hay prueba de que el token cambió.
    const freshToken = await getAccessToken()
    if (freshToken && freshToken !== token) {
      const retried = await send(url, init, freshToken)
      if (!retried.ok) detail = await parseErrorBody(retried)
      res = retried
    }

    if (!res.ok) {
      if (res.status === 401) {
        handleUnauthorized(path, detail, true, freshToken ?? token)
      }
      throw new ApiError(`API ${res.status} en ${path}`, res.status, detail)
    }
  } else if (!res.ok) {
    const detail = await parseErrorBody(res)
    throw new ApiError(`API ${res.status} en ${path}`, res.status, detail)
  }

  if (res.status === 204) return undefined as T
  if (responseType === 'blob') return (await res.blob()) as T
  return (await res.json()) as T
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST' }),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT' }),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH' }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}