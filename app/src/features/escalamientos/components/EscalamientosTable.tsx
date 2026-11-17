import { Link } from 'react-router-dom'
import { MessagesSquare, CheckCircle2, Inbox } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/common/Button'
import type { EscalamientoOut } from '../types'

interface EscalamientosTableProps {
  items: EscalamientoOut[]
  loading?: boolean
  onResolve?: (notificationId: number) => void
  resolvingId?: number | null
}

function EstadoBadge({ estado }: { estado: EscalamientoOut['workflow_estado'] }) {
  const resolved = estado === 'RESOLVED'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        resolved ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning',
      )}
    >
      {resolved ? <CheckCircle2 size={10} aria-hidden /> : <Inbox size={10} aria-hidden />}
      {resolved ? 'Resuelto' : estado === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
    </span>
  )
}

const MOTIVO_LABEL: Record<string, string> = {
  DOMAIN_OUT_OF_SCOPE: 'Fuera de dominio',
  LLM_FAILURE: 'Fallo del modelo',
  FRUSTRATION: 'Posible frustración',
}

export function EscalamientosTable({ items, loading = false, onResolve, resolvingId = null }: EscalamientosTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border bg-surface">
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={18} />}
        title="No hay escalamientos."
        description="Las consultas derivadas a Secretaría aparecerán aquí."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Motivo</th>
            <th className="px-4 py-3 font-medium">Resumen</th>
            <th className="px-4 py-3 font-medium">Conversación</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            {onResolve && <th className="px-4 py-3 font-medium">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((esc) => (
            <tr key={esc.id} className="transition-colors hover:bg-muted/40">
              <td className="px-4 py-3">
                <span className="font-medium text-foreground">
                  {MOTIVO_LABEL[esc.motivo] ?? esc.motivo}
                </span>
              </td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-2 text-muted-foreground">{esc.resumen ?? '—'}</p>
              </td>
              <td className="px-4 py-3">
                {esc.conversacion_id !== null && esc.conversacion_id !== undefined ? (
                  <Link
                    to={`/conversations/${esc.conversacion_id}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <MessagesSquare size={12} aria-hidden />
                    #{esc.conversacion_id}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <EstadoBadge estado={esc.workflow_estado} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {formatDate(esc.created_at)}
              </td>
              {onResolve && (
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {esc.workflow_estado === 'RESOLVED' || esc.workflow_estado === 'CANCELLED' ? (
                    <span className="text-xs text-muted-foreground">
                      {esc.resolved_by ? `Por ${esc.resolved_by.slice(0, 12)}…` : '—'}
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onResolve(esc.id)}
                      disabled={resolvingId === esc.id}
                      aria-label={`Resolver escalamiento ${esc.id}`}
                    >
                      <CheckCircle2 size={14} aria-hidden />
                      {resolvingId === esc.id ? 'Resolviendo…' : 'Resolver'}
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}