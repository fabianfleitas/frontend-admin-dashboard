import { Link } from 'react-router-dom'
import { type LucideIcon, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionCardProps {
  to: string
  label: string
  description?: string
  icon: LucideIcon
}

export function QuickActionCard({ to, label, description, icon: Icon }: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-surface px-4 py-3 shadow-sm transition-colors hover:border-primary hover:bg-muted',
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon size={18} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <ChevronRight
        size={16}
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden
      />
    </Link>
  )
}