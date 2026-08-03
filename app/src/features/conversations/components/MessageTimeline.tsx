import { useEffect, useRef } from 'react'
import { MessageBubble } from '@/features/chat/components/MessageBubble'
import { EmptyState } from '@/components/feedback/EmptyState'
import { MessagesSquare } from 'lucide-react'
import type { MessageOut } from '@/features/chat/types'

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
        .map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
    </div>
  )
}