import { useEffect, useRef } from 'react'
import { MessageBubble } from '@/features/chat/components/MessageBubble'
import { EmptyState } from '@/components/feedback/EmptyState'
import { MessagesSquare, FileText } from 'lucide-react'
import { FeedbackBadge } from './FeedbackBadge'
import { isAssistantMessage, type MessageOut } from '@/features/chat/types'

interface MessageTimelineProps {
  messages: MessageOut[]
}

export function MessageTimeline({ messages }: MessageTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<MessagesSquare size={16} />}
        title="Sin mensajes."
        description="La conversación no contiene mensajes registrados."
      />
    )
  }

  return (
    <div ref={scrollRef} className="space-y-4 overflow-y-auto">
      {messages
        .slice()
        .sort((a, b) => new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime())
        .map((message) => {
          const isAssistant = isAssistantMessage(message)
          const sources = message.sources ?? []
          return (
            <div key={message.id} className="space-y-1.5">
              <MessageBubble message={message} />
              {isAssistant && (
                <div className="flex flex-wrap items-center gap-2 pl-11 text-xs">
                  <FeedbackBadge rating={message.rating ?? null} />
                  {sources.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <FileText size={12} aria-hidden />
                      {sources.length} fuente(s) recuperada(s)
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}