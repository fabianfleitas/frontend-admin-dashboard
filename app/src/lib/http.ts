import { supabase } from './supabase'
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

async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
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

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body: dataBody, query, headers, multipart, responseType, ...rest } = options

  const initHeaders = new Headers(headers)
  const token = await getAccessToken()
  if (token) {
    initHeaders.set('Authorization', `Bearer ${token}`)
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

    if (res.status === 401) {
      useAuthStore.getState().setUser(null)
      supabase.auth.signOut().catch(() => {})
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

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