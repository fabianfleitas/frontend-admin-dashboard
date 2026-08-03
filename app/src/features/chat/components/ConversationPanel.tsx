import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { MessageList } from './MessageList'
import type { MessageOut } from '../types'

interface ConversationPanelProps {
  messages: MessageOut[]
  loading: boolean
  conversationId: number | null
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  onNewConversation: () => void
  onClear: () => void
  disabled: boolean
}

export function ConversationPanel({
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onNewConversation,
  onClear,
  disabled,
}: ConversationPanelProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && input.trim()) onSend()
    }
  }

  function copyLastResponse() {
    const lastAssistant = [...messages].reverse().find((m) => m.rol_mensaje === 'assistant')
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.contenido_texto)
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Conversación</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={copyLastResponse} disabled={!messages.length}>
            <Copy size={12} aria-hidden />
            Copiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!messages.length || loading}
          >
            <Trash2 size={12} aria-hidden />
            Limpiar
          </Button>
          <Button variant="secondary" size="sm" onClick={onNewConversation} disabled={loading}>
            <Plus size={12} aria-hidden />
            Nueva
          </Button>
        </div>
      </div>

      <MessageList messages={messages} loading={loading} />

      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una pregunta para el asistente… (Enter para enviar, Shift+Enter para salto de línea)"
          className="min-h-24 w-full resize-none rounded-md border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          disabled={disabled}
        />
        <div className="flex justify-end">
          <Button onClick={onSend} disabled={disabled || !input.trim()}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}