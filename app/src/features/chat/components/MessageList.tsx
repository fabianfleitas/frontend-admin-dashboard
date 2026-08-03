import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { Skeleton } from '@/components/feedback/Skeleton'
import type { MessageOut } from '../types'

interface MessageListProps {
  messages: MessageOut[]
  loading?: boolean
}

export function MessageList({ messages, loading = false }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, loading])

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Bot size={28} className="text-primary" aria-hidden />
        <p>Inicia una conversación para probar el asistente.</p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {loading && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot size={16} aria-hidden />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-16 w-72" />
            <p className="text-xs text-muted-foreground">La IA está generando una respuesta…</p>
          </div>
        </div>
      )}
    </div>
  )
}