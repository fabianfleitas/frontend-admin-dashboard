import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/feedback/Skeleton'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number | null
  icon: LucideIcon
  hint?: string
  tone?: 'default' | 'warning'
  loading?: boolean
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'default',
  loading = false,
}: MetricCardProps) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p
            className={cn(
              'truncate text-2xl font-semibold tracking-tight',
              tone === 'warning' ? 'text-warning' : 'text-foreground',
            )}
          >
            {value ?? '—'}
          </p>
        )}
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon size={18} aria-hidden />
      </div>
    </Card>
  )
}