import { useState } from 'react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useChatFeedback } from '../hooks/useChatFeedback'
import { toast } from '@/stores/toast.store'
import { cn } from '@/lib/utils'
import type { ChatFeedbackIn } from '../types'

interface FeedbackButtonsProps {
  messageId: number
  auditId: string
  disabled?: boolean
}

export function FeedbackButtons({ messageId, auditId, disabled }: FeedbackButtonsProps) {
  const feedback = useChatFeedback()
  const [selected, setSelected] = useState<'up' | 'down' | null>(null)

  async function send(rating: 5 | 1, kind: 'up' | 'down') {
    setSelected(kind)
    const input: ChatFeedbackIn = {
      message_id: messageId,
      rating,
      audit_id: auditId,
    }
    try {
      await feedback.mutateAsync(input)
      toast.success(kind === 'up' ? 'Gracias por tu feedback.' : 'Gracias por el feedback negativo.')
    } catch (err) {
      setSelected(null)
      toast.error('No fue posible registrar el feedback.', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => send(5, 'up')}
        disabled={disabled || feedback.isPending || selected !== null}
        className={cn(
          'rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          selected === 'up'
            ? 'bg-success/10 text-success'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
        aria-label="Respuesta útil"
        title="Útil"
      >
        <ThumbsUp size={14} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => send(1, 'down')}
        disabled={disabled || feedback.isPending || selected !== null}
        className={cn(
          'rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          selected === 'down'
            ? 'bg-danger/10 text-danger'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
        aria-label="Respuesta no útil"
        title="No útil"
      >
        <ThumbsDown size={14} aria-hidden />
      </button>
    </div>
  )
}