import { ThumbsDown, ThumbsUp, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackBadgeProps {
  rating?: number | null
  className?: string
}

export function FeedbackBadge({ rating, className }: FeedbackBadgeProps) {
  if (rating === null || rating === undefined) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground',
          className,
        )}
      >
        <Minus size={10} aria-hidden />
        Sin feedback
      </span>
    )
  }
  const positive = rating >= 4
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
        positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
        className,
      )}
    >
      {positive ? <ThumbsUp size={10} aria-hidden /> : <ThumbsDown size={10} aria-hidden />}
      {positive ? 'Positivo' : 'Negativo'}
    </span>
  )
}