export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'

export interface CategoryOut {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
  institucion_id: number
  fecha_creacion: string
}

export interface DocumentVersionOut {
  id: number
  documento_id: number
  numero_version: number
  ruta_archivo: string
  status: DocumentStatus
  es_version_activa: boolean
  total_chunks: number
  embedding_model: string | null
  fecha_carga: string
  indexed_at: string | null
  cargado_por_external_auth_id: string
}

export interface DocumentOut {
  id: number
  categoria_id: number | null
  codigo_documento: string | null
  titulo: string
  descripcion: string | null
  activo: boolean
  fecha_creacion: string
  version_activa: DocumentVersionOut | null
}

export interface DocumentDetailOut {
  id: number
  categoria_id: number | null
  codigo_documento: string | null
  titulo: string
  descripcion: string | null
  activo: boolean
  fecha_creacion: string
  versiones: DocumentVersionOut[]
}

export interface AdminUploadDocumentOut {
  document: DocumentOut
  version: DocumentVersionOut
}

export interface AdminUploadVersionOut {
  document: DocumentOut
  version: DocumentVersionOut
}

export interface AdminReindexOut {
  updated_versions: number
}

export interface ListDocumentsParams {
  limit?: number
  offset?: number
}