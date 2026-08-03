import { cn } from '@/lib/utils'
import type { UserRole } from '../types'

type Tone = 'success' | 'warning' | 'neutral'

const ROLE_CONFIG: Record<UserRole, { label: string; tone: Tone }> = {
  ADMIN: { label: 'Admin', tone: 'warning' },
  STAFF: { label: 'Staff', tone: 'success' },
  STUDENT: { label: 'Estudiante', tone: 'neutral' },
}

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-muted text-muted-foreground',
}

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const cfg = ROLE_CONFIG[role]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONE_CLASSES[cfg.tone],
        className,
      )}
    >
      {cfg.label}
    </span>
  )
}