import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ShieldCheck } from 'lucide-react'
import type { AuditLogOut } from '../types'

interface AuditTableProps {
  logs: AuditLogOut[]
  loading?: boolean
  onSelect: (log: AuditLogOut) => void
  selectedId?: string | null
  search?: string
}

function matchSearch(log: AuditLogOut, q: string): boolean {
  return (
    log.id.toLowerCase().includes(q) ||
    String(log.mensaje_id).includes(q) ||
    (log.observaciones ?? '').toLowerCase().includes(q)
  )
}

function scoreTone(value: number | null): 'success' | 'warning' | 'danger' | 'neutral' {
  if (value === null) return 'neutral'
  if (value >= 0.85) return 'success'
  if (value >= 0.6) return 'warning'
  return 'danger'
}

const TONE_CLASSES: Record<'success' | 'warning' | 'danger' | 'neutral', string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  neutral: 'text-muted-foreground',
}

export function AuditTable({
  logs,
  loading = false,
  onSelect,
  selectedId,
  search = '',
}: AuditTableProps) {
  const q = search.trim().toLowerCase()
  const filtered = q ? logs.filter((l) => matchSearch(l, q)) : logs

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

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck size={18} />}
        title="No existen registros de auditoría."
        description="Aún no se han registrado evaluaciones del sistema."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Mensaje</th>
            <th className="px-4 py-3 font-medium">Fidelidad</th>
            <th className="px-4 py-3 font-medium">Relevancia</th>
            <th className="px-4 py-3 font-medium">Contexto</th>
            <th className="px-4 py-3 font-medium">Fecha evaluación</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map((log) => {
            const isSelected = selectedId === log.id
            return (
              <tr
                key={log.id}
                onClick={() => onSelect(log)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/40',
                  isSelected && 'bg-primary/5',
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground" title={log.id}>
                  {log.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  #{log.mensaje_id}
                </td>
                <td className={cn('px-4 py-3 font-medium', TONE_CLASSES[scoreTone(log.score_fidelidad)])}>
                  {log.score_fidelidad !== null ? `${Math.round(log.score_fidelidad * 100)}%` : '—'}
                </td>
                <td className={cn('px-4 py-3 font-medium', TONE_CLASSES[scoreTone(log.score_relevancia)])}>
                  {log.score_relevancia !== null ? `${Math.round(log.score_relevancia * 100)}%` : '—'}
                </td>
                <td className={cn('px-4 py-3 font-medium', TONE_CLASSES[scoreTone(log.score_contexto)])}>
                  {log.score_contexto !== null ? `${Math.round(log.score_contexto * 100)}%` : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(log.fecha_evaluacion)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}