import { StatusBadge as BaseStatusBadge } from '@/features/dashboard/components/StatusBadge'
import type { DocumentStatus } from '../types'
import { cn } from '@/lib/utils'

interface DocumentStatusBadgeProps {
  status?: DocumentStatus | null
  activo: boolean
  className?: string
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  READY: { label: 'Ready', tone: 'success' },
  PROCESSING: { label: 'Processing', tone: 'warning' },
  PENDING: { label: 'Pending', tone: 'neutral' },
  FAILED: { label: 'Failed', tone: 'danger' },
}

export function DocumentStatusBadge({ status, activo, className }: DocumentStatusBadgeProps) {
  if (!activo) {
    return <BaseStatusBadge label="Inactive" tone="neutral" className={cn(className)} />
  }
  if (!status) {
    return <BaseStatusBadge label="—" tone="neutral" className={cn(className)} />
  }
  const cfg = STATUS_CONFIG[status]
  return <BaseStatusBadge label={cfg.label} tone={cfg.tone} className={cn(className)} />
}