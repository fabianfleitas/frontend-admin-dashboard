import { cn } from '@/lib/utils'
import type { MemberType } from '@/lib/roles'

interface MemberBadgeProps {
  type: MemberType | null | undefined
  className?: string
}

const CONFIG: Record<MemberType, { label: string; cls: string }> = {
  ADMIN: { label: 'Administrador', cls: 'bg-warning/10 text-warning' },
  SECRETARIA: { label: 'Secretaría', cls: 'bg-success/10 text-success' },
  ESTUDIANTE: { label: 'Estudiante', cls: 'bg-muted text-muted-foreground' },
}

export function MemberBadge({ type, className }: MemberBadgeProps) {
  if (!type) {
    return <span className="text-xs text-muted-foreground">Sin membresía</span>
  }
  const cfg = CONFIG[type]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        cfg.cls,
        className,
      )}
    >
      {cfg.label}
    </span>
  )
}