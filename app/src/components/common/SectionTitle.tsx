import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function SectionTitle({ title, description, action, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}