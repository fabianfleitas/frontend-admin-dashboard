export type MessageRole = 'user' | 'assistant' | 'system'

export interface MessageOut {
  id: number
  conversacion_id: number
  rol_mensaje: string
  contenido_texto: string
  proveedor_ia: string | null
  modelo_ia: string | null
  temperatura: number | null
  tokens_input: number | null
  tokens_output: number | null
  tiempo_respuesta_ms: number | null
  fecha_envio: string
  audit_id: string | null
}

export interface SourceOut {
  document_id: number
  document: string
  page: number
  similarity_score: number
}

export interface ChatQueryIn {
  conversation_id: number
  message: string
}

export interface ChatQueryOut {
  response: string
  sources: SourceOut[]
  audit_id: string
  conversation_id: number
  user_message: MessageOut
  assistant_message: MessageOut
}

export interface ChatFeedbackIn {
  message_id: number
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string | null
  audit_id: string
}

export interface ChatFeedbackOut {
  id: number
  message_id: number
  rating: number
  comment: string | null
  audit_id: string
  created_at: string
}