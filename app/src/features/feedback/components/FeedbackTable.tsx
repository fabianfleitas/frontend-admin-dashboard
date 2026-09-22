import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsDown, ThumbsUp, MessagesSquare, ThumbsUp as EmptyThumbs, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import type { AdminFeedbackOut } from '../types'

interface FeedbackTableProps {
  items: AdminFeedbackOut[]
  loading?: boolean
  onDelete?: (feedbackId: number) => void
  deletingId?: number | null
}

function RatingBadge({ rating }: { rating: number }) {
  const positive = rating >= 4
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
      )}
    >
      {positive ? <ThumbsUp size={10} aria-hidden /> : <ThumbsDown size={10} aria-hidden />}
      {positive ? 'Positivo' : 'Negativo'} · {rating}/5
    </span>
  )
}

export function FeedbackTable({ items, loading = false, onDelete, deletingId = null }: FeedbackTableProps) {
  const [confirm, setConfirm] = useState<AdminFeedbackOut | null>(null)
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
        icon={<EmptyThumbs size={18} />}
        title="No hay feedback."
        description="Aún no se ha registrado feedback de los usuarios sobre las respuestas."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Valoración</th>
            <th className="px-4 py-3 font-medium">Mensaje del asistente</th>
            <th className="px-4 py-3 font-medium">Comentario</th>
            <th className="px-4 py-3 font-medium">Conversación</th>
            <th className="px-4 py-3 font-medium">Usuario</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            {onDelete && <th className="px-4 py-3 font-medium">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((fb) => (
            <tr key={fb.id} className="transition-colors hover:bg-muted/40">
              <td className="px-4 py-3">
                <RatingBadge rating={fb.rating} />
              </td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-2 text-muted-foreground">
                  {fb.contenido_texto ?? '—'}
                </p>
              </td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-2 text-muted-foreground">{fb.comment ?? '—'}</p>
              </td>
              <td className="px-4 py-3">
                {fb.conversacion_id !== null && fb.conversacion_id !== undefined ? (
                  <Link
                    to={`/conversations/${fb.conversacion_id}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <MessagesSquare size={12} aria-hidden />
                    #{fb.conversacion_id}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td
                className="px-4 py-3 font-mono text-xs text-muted-foreground"
                title={fb.external_auth_id ?? undefined}
              >
                {fb.external_auth_id ? `${fb.external_auth_id.slice(0, 12)}…` : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {formatDate(fb.created_at)}
              </td>
              {onDelete && (
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-danger"
                    onClick={() => setConfirm(fb)}
                    disabled={deletingId === fb.id}
                    aria-label={`Eliminar feedback ${fb.id}`}
                  >
                    <Trash2 size={14} aria-hidden />
                    Eliminar
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title="Eliminar feedback"
        description="Esta acción ocultará el feedback del listado."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              disabled={deletingId === confirm?.id}
              onClick={() => {
                if (confirm) {
                  onDelete?.(confirm.id)
                  setConfirm(null)
                }
              }}
            >
              {deletingId === confirm?.id ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          ¿Seguro que deseas eliminar el feedback
          {confirm ? ` #${confirm.id}` : ''}? No se podrá recuperar desde el
          listado.
        </p>
      </Modal>
    </div>
  )
}