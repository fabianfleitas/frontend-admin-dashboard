export type MessageRole = 'USER' | 'ASSISTANT'

export interface MessageOut {
  id: number
  conversacion_id: number
  rol_mensaje: MessageRole
  contenido_texto: string
  proveedor_ia: string | null
  modelo_ia: string | null
  temperatura: number | null
  tokens_input: number | null
  tokens_output: number | null
  tiempo_respuesta_ms: number | null
  fecha_envio: string
  audit_id: string | null
  sources?: SourceOut[]
  rating?: number | null
  feedback_comment?: string | null
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

export function isAssistantMessage(m: { rol_mensaje: MessageRole }): boolean {
  return m.rol_mensaje === 'ASSISTANT'
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

export interface AudioInteractionOut {
  id: number
  mensaje_id: number
  ruta_audio_original: string
  ruta_audio_respuesta: string | null
  transcripcion: string | null
  transcription_model: string | null
  duracion_segundos: number | null
  formato_audio: string | null
  tamano_bytes: number | null
  fecha_creacion: string
}

export interface ChatVoiceOut {
  response: string
  sources: SourceOut[]
  transcription: string
  audio_interaction: AudioInteractionOut
  audit_id: string
  conversation_id: number
  user_message: MessageOut
  assistant_message: MessageOut
}