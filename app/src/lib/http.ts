import { supabase } from './supabase'

export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

if (!API_URL) {
  console.warn('[http] VITE_API_URL no está configurada en el entorno.')
}

export type AuthHeaders = {
  'X-External-Auth-Id': string | null
  'X-Auth-Provider': 'delegated'
  'X-User-Type': 'ADMIN' | 'SECRETARIA' | 'ESTUDIANTE'
  'X-User-Email': string | null
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

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
  multipart?: boolean
  /** Override X-User-Type for endpoints that target non-admin scopes. */
  userTypeOverride?: AuthHeaders['X-User-Type']
}

async function getAuthHeaders(
  userTypeOverride?: AuthHeaders['X-User-Type'],
): Promise<AuthHeaders> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  return {
    'X-External-Auth-Id': user?.id ?? null,
    'X-Auth-Provider': 'delegated',
    'X-User-Type': userTypeOverride ?? 'ADMIN',
    'X-User-Email': user?.email ?? null,
  }
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

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body: dataBody, query, headers, multipart, userTypeOverride, ...rest } = options

  const authHeaders = await getAuthHeaders(userTypeOverride)
  const initHeaders = new Headers(authHeaders as Record<string, string>)
  if (headers) {
    new Headers(headers).forEach((value, key) => initHeaders.set(key, value))
  }

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

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    headers: initHeaders,
    body: finalBody,
  })

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