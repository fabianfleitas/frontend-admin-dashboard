import { History } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/feedback/Skeleton'
import { useAuthCapabilities } from '@/features/auth/hooks/useAuthCapabilities'
import { useAudit } from '@/features/audit/hooks/useAudit'
import { formatDate } from '@/lib/utils'

function formatScore(value: number | null): string {
  if (value === null) return '—'
  return `${Math.round(value * 100)}%`
}

function scoreTone(value: number | null): string {
  if (value === null) return 'text-muted-foreground'
  if (value >= 0.85) return 'text-success'
  if (value >= 0.6) return 'text-warning'
  return 'text-danger'
}

export function ActivityTimeline() {
  const { isStaff, isPlatformAdmin } = useAuthCapabilities()
  const canViewAudit = isStaff || isPlatformAdmin
  const auditQuery = useAudit({ limit: 8, enabled: canViewAudit })
  const items = canViewAudit ? (auditQuery.data?.items ?? []) : []

  return (
    <Card className="space-y-4">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        Actividad reciente
      </h2>

      {!canViewAudit ? (
        <EmptyState
          icon={<History size={18} />}
          title="No hay actividad disponible para tu perfil."
          description="El acceso a la auditoría requiere membresía de personal institucional (Administrador o Secretaría)."
        />
      ) : auditQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5 border-l-2 border-border pl-3">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      ) : auditQuery.isError ? (
        <ErrorState
          message="No fue posible cargar la actividad reciente."
          onRetry={() => auditQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<History size={18} />}
          title="No hay actividad de auditoría registrada."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((log) => (
            <li key={log.id} className="space-y-1 border-l-2 border-border pl-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(log.fecha_evaluacion)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Mensaje #{log.mensaje_id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                <span className="text-muted-foreground">Fidelidad</span>
                <span className={`font-medium tabular-nums ${scoreTone(log.score_fidelidad)}`}>
                  {formatScore(log.score_fidelidad)}
                </span>
                <span className="text-muted-foreground">Relevancia</span>
                <span className={`font-medium tabular-nums ${scoreTone(log.score_relevancia)}`}>
                  {formatScore(log.score_relevancia)}
                </span>
                <span className="text-muted-foreground">Contexto</span>
                <span className={`font-medium tabular-nums ${scoreTone(log.score_contexto)}`}>
                  {formatScore(log.score_contexto)}
                </span>
              </div>
              {log.observaciones && (
                <p className="line-clamp-2 text-xs text-muted-foreground">{log.observaciones}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}