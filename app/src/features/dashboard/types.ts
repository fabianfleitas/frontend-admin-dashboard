export interface ReadyOut {
  status: string
  services: Record<string, boolean>
}

export interface MetricsOut {
  total_queries: number
  total_conversations: number
  total_documents: number
  total_feedbacks: number
  avg_response_time: number
  avg_fidelity: number
  avg_relevance: number
  system_status: string
}