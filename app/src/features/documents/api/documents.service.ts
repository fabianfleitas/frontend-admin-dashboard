import { http } from '@/lib/http'
import type {
  AdminReindexOut,
  AdminUploadDocumentOut,
  AdminUploadVersionOut,
  CategoryIn,
  CategoryOut,
  DocumentDetailOut,
  DocumentOut,
  ListDocumentsParams,
} from '../types'
import type { PaginatedResponse } from '@/types/pagination'

export function listCategories(params: ListDocumentsParams = {}) {
  return http.get<PaginatedResponse<CategoryOut>>('/api/admin/categories', {
    query: { limit: params.limit, offset: params.offset },
  })
}

export function createCategory(input: CategoryIn) {
  return http.post<CategoryOut>('/api/admin/categories', { body: input })
}

export function updateCategory(categoriaId: number, input: CategoryIn) {
  return http.put<CategoryOut>(`/api/admin/categories/${categoriaId}`, { body: input })
}

export function deleteCategory(categoriaId: number) {
  return http.delete<void>(`/api/admin/categories/${categoriaId}`)
}

export function listDocuments(params: ListDocumentsParams = {}) {
  return http.get<PaginatedResponse<DocumentOut>>('/api/admin/documents', {
    query: { limit: params.limit, offset: params.offset },
  })
}

export function getDocument(documentoId: number) {
  return http.get<DocumentDetailOut>(`/api/admin/documents/${documentoId}`)
}

export interface UploadDocumentInput {
  file: File
  titulo: string
  descripcion?: string | null
  categoria_id?: number | null
  codigo_documento?: string | null
}

export function uploadDocument(input: UploadDocumentInput) {
  const form = new FormData()
  form.append('file', input.file)
  form.append('titulo', input.titulo)
  if (input.descripcion) form.append('descripcion', input.descripcion)
  if (input.categoria_id !== null && input.categoria_id !== undefined) {
    form.append('categoria_id', String(input.categoria_id))
  }
  if (input.codigo_documento) form.append('codigo_documento', input.codigo_documento)
  return http.post<AdminUploadDocumentOut>('/api/admin/documents', {
    body: form,
    multipart: true,
  })
}

export function uploadNewVersion(documentoId: number, file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post<AdminUploadVersionOut>(
    `/api/admin/documents/${documentoId}/versions`,
    { body: form, multipart: true },
  )
}

export function reindex(documentoId?: number) {
  return http.post<AdminReindexOut>('/api/admin/reindex', {
    body: documentoId !== undefined ? { documento_id: documentoId } : {},
  })
}

export function deactivateDocument(documentoId: number) {
  return http.delete<DocumentOut>(`/api/admin/documents/${documentoId}`)
}