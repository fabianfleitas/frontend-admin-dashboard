import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ConversationPanel } from '../components/ConversationPanel'
import { ContextPanel } from '../components/ContextPanel'
import { MetricsCard } from '../components/MetricsCard'
import { FeedbackButtons } from '../components/FeedbackButtons'
import { AudioPlayer } from '../components/AudioPlayer'
import { useChatQuery } from '../hooks/useChatQuery'
import { useCreateConversation } from '../hooks/useCreateConversation'
import { useSendVoice } from '../hooks/useSendVoice'
import { ApiError } from '@/lib/http'
import { toast } from '@/stores/toast.store'
import { isAssistantMessage } from '../types'
import type { AudioInteractionOut, MessageOut, SourceOut } from '../types'

export function PlaygroundPage() {
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<MessageOut[]>([])
  const [sources, setSources] = useState<SourceOut[]>([])
  const [input, setInput] = useState('')
  const [lastQuery, setLastQuery] = useState<string | null>(null)
  const [audioInteraction, setAudioInteraction] = useState<AudioInteractionOut | null>(null)

  const createConversation = useCreateConversation()
  const chatQuery = useChatQuery()
  const voiceQuery = useSendVoice()

  const isLoading =
    createConversation.isPending || chatQuery.isPending || voiceQuery.isPending
  const lastAssistant = [...messages].reverse().find((m) => isAssistantMessage(m)) ?? null

  async function ensureConversation(): Promise<number | null> {
    if (conversationId !== null) return conversationId
    try {
      const conv = await createConversation.mutateAsync()
      setConversationId(conv.id)
      return conv.id
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No fue posible crear la conversación.'
      toast.error(message)
      return null
    }
  }

  function optimisticUser(contenido: string): MessageOut {
    return {
      id: -Math.floor(Math.random() * 100000),
      conversacion_id: conversationId ?? -1,
      rol_mensaje: 'USER' as const,
      contenido_texto: contenido,
      proveedor_ia: null,
      modelo_ia: null,
      temperatura: null,
      tokens_input: null,
      tokens_output: null,
      tiempo_respuesta_ms: null,
      fecha_envio: new Date().toISOString(),
      audit_id: null,
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    setLastQuery(text)
    setInput('')
    setAudioInteraction(null)

    // Mensaje optimista del usuario (se reemplaza por el persistido).
    const optimistic = optimisticUser(text)
    setMessages((prev) => [...prev, optimistic])

    const convId = await ensureConversation()
    if (convId === null) {
      setMessages((prev) => prev.filter((m) => m !== optimistic))
      setInput(text)
      return
    }

    try {
      const result = await chatQuery.mutateAsync({
        conversation_id: convId,
        message: text,
      })
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m !== optimistic)
        return [...withoutOptimistic, result.user_message, result.assistant_message]
      })
      setSources(result.sources)
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m !== optimistic))
      setInput(text)
      toast.error(
        'No fue posible obtener la respuesta.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  async function handleSendVoice(file: File) {
    if (isLoading) return
    setAudioInteraction(null)

    // Mensaje optimista del usuario (se reemplaza por el persistido con la transcripción).
    const optimistic = optimisticUser('[Audio]')
    setMessages((prev) => [...prev, optimistic])

    const convId = await ensureConversation()
    if (convId === null) {
      setMessages((prev) => prev.filter((m) => m !== optimistic))
      return
    }

    try {
      const result = await voiceQuery.mutateAsync({ conversationId: convId, file })
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m !== optimistic)
        return [...withoutOptimistic, result.user_message, result.assistant_message]
      })
      setSources(result.sources)
      setAudioInteraction(result.audio_interaction)
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m !== optimistic))
      if (err instanceof ApiError && err.status === 503) {
        toast.error('No fue posible transcribir el audio. Intenta nuevamente.')
      } else {
        toast.error(
          'No fue posible enviar el audio.',
          err instanceof Error ? err.message : undefined,
        )
      }
    }
  }

  async function handleRegenerate() {
    if (!lastQuery || isLoading || conversationId === null) return
    setInput('')
    setAudioInteraction(null)
    try {
      const result = await chatQuery.mutateAsync({
        conversation_id: conversationId,
        message: lastQuery,
      })
      setMessages((prev) => [...prev, result.user_message, result.assistant_message])
      setSources(result.sources)
    } catch (err) {
      toast.error(
        'No fue posible regenerar la respuesta.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  function handleNewConversation() {
    setConversationId(null)
    setMessages([])
    setSources([])
    setInput('')
    setLastQuery(null)
    setAudioInteraction(null)
  }

  function handleClear() {
    setMessages([])
    setSources([])
    setAudioInteraction(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          AI Agent Playground
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entorno de validación del sistema RAG. Diagnóstico, pruebas y análisis.
        </p>
      </div>

      {chatQuery.isError && (
        <ErrorState
          message="No fue posible obtener la respuesta del asistente."
          onRetry={handleSend}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex h-[32rem] flex-col">
          <ConversationPanel
            messages={messages}
            loading={isLoading}
            conversationId={conversationId}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onSendVoice={handleSendVoice}
            onNewConversation={handleNewConversation}
            onClear={handleClear}
            disabled={isLoading}
          />
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Respuesta</h2>
              <div className="flex items-center gap-2">
                {lastAssistant && (
                  <FeedbackButtons
                    messageId={lastAssistant.id}
                    auditId={lastAssistant.audit_id ?? ''}
                    disabled={isLoading}
                  />
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={!lastQuery || isLoading}
                >
                  <RefreshCw size={12} aria-hidden className={isLoading ? 'animate-spin' : ''} />
                  Regenerar
                </Button>
              </div>
            </div>
            <div className="min-h-32 rounded-md border bg-muted/30 px-4 py-3 text-sm whitespace-pre-wrap text-foreground">
              {lastAssistant?.contenido_texto ?? (
                <span className="text-muted-foreground">
                  La respuesta del asistente aparecerá aquí.
                </span>
              )}
            </div>
            {audioInteraction?.ruta_audio_respuesta && (
              <div className="pt-3">
                <AudioPlayer audioInteractionId={audioInteraction.id} />
              </div>
            )}
          </Card>

          <MetricsCard message={lastAssistant} />
          <ContextPanel sources={sources} lastAssistantMessage={lastAssistant} />
        </div>
      </div>
    </div>
  )
}