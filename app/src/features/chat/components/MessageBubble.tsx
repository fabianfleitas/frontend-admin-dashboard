import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { MessageOut } from '../types'

interface MessageBubbleProps {
  message: MessageOut
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.rol_mensaje === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3',
        isAssistant ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isAssistant ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
        aria-hidden
      >
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className={cn('max-w-[85%] space-y-1', isAssistant ? 'text-left' : 'text-right')}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{isAssistant ? 'Asistente' : 'Tú'}</span>
          <span>{formatDate(message.fecha_envio)}</span>
        </div>
        <div
          className={cn(
            'whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm',
            isAssistant
              ? 'bg-surface border text-foreground'
              : 'bg-primary text-primary-foreground',
          )}
        >
          {message.contenido_texto}
        </div>
      </div>
    </div>
  )
}