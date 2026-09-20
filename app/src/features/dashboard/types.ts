export interface ReadyOut {
  status: string
  services: Record<string, boolean>
}

export type TokensByModel = Record<string, Record<string, number>>

export interface MetricsOut {
  total_queries: number
  total_conversations: number
  total_documents: number
  total_feedbacks: number
  avg_response_time: number
  avg_fidelity: number
  avg_relevance: number
  system_status: string
  total_llm_responses: number
  total_guard: number
  total_llm_failed: number
  guard_rate: number
  llm_failed_rate: number
  total_tokens_input: number
  total_tokens_output: number
  tokens_by_model: TokensByModel
  avg_retrieval_similarity: number
  total_voice_queries: number
  total_text_queries: number
  avg_response_time_voice: number
  avg_response_time_text: number
  series: MetricSeriesPoint[]
  top_documents: DocumentMetricOut[]
  documents_by_category: CategoryMetricOut[]
  desde: string | null
  hasta: string | null
  categoria_id: number | null
  modelo: string | null
  documento_id: number | null
  granularidad: string | null
}

export interface MetricSeriesPoint {
  fecha: string
  conversaciones: number
  tokens_input: number
  tokens_output: number
  llm: number
  guard: number
  llm_failed: number
}

export interface DocumentMetricOut {
  documento_id: number
  titulo: string | null
  consultas: number
}

export interface CategoryMetricOut {
  categoria_id: number | null
  nombre: string | null
  consultas: number
}

export interface MetricsFilters {
  desde?: string
  hasta?: string
  categoria_id?: number
  modelo?: string
  documento_id?: number
  granularidad?: 'day' | 'week' | 'month'
}