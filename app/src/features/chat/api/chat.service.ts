import { http } from '@/lib/http'
import type {
  ChatFeedbackIn,
  ChatFeedbackOut,
  ChatQueryIn,
  ChatQueryOut,
} from '../types'

export function sendMessage(input: ChatQueryIn): Promise<ChatQueryOut> {
  return http.post<ChatQueryOut>('/api/chat/query', { body: input })
}

export function sendFeedback(input: ChatFeedbackIn): Promise<ChatFeedbackOut> {
  return http.post<ChatFeedbackOut>('/api/chat/feedback', { body: input })
}

export function sendVoice(
  conversationId: number,
  audio: File,
): Promise<import('../types').ChatQueryOut & { transcription: string; audio_interaction: unknown }> {
  const form = new FormData()
  form.append('audio', audio)
  return http.post('/api/chat/voice', {
    body: form,
    multipart: true,
    query: { conversation_id: conversationId },
  })
}