import { http } from '@/lib/http'
import type {
  ChatFeedbackIn,
  ChatFeedbackOut,
  ChatQueryIn,
  ChatQueryOut,
  ChatVoiceOut,
} from '../types'

export function sendMessage(input: ChatQueryIn): Promise<ChatQueryOut> {
  return http.post<ChatQueryOut>('/api/chat/query', { body: input })
}

export function sendFeedback(input: ChatFeedbackIn): Promise<ChatFeedbackOut> {
  return http.post<ChatFeedbackOut>('/api/chat/feedback', { body: input })
}

export function sendVoice(conversationId: number, audio: File): Promise<ChatVoiceOut> {
  const form = new FormData()
  form.append('audio', audio)
  return http.post<ChatVoiceOut>('/api/chat/voice', {
    body: form,
    multipart: true,
    query: { conversation_id: conversationId },
  })
}

export function getAudio(audioInteractionId: number): Promise<Blob> {
  return http.get<Blob>(`/api/chat/audio/${audioInteractionId}`, { responseType: 'blob' })
}