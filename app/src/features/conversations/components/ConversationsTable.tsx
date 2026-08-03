import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { MessagesSquare } from 'lucide-react'
import type { ConversationSummaryOut } from '../types'

interface ConversationsTableProps {
  conversations: ConversationSummaryOut[]
  loading?: boolean
  onSelect: (id: number) => void
  selectedId?: number | null
  search?: string
}

function matchSearch(conv: ConversationSummaryOut, q: string): boolean {
  return (
    conv.title.toLowerCase().includes(q) ||
    String(conv.id).includes(q)
  )
}

export function ConversationsTable({
  conversations,
  loading = false,
  onSelect,
  selectedId,
  search = '',
}: ConversationsTableProps) {
  const q = search.trim().toLowerCase()
  const filtered = q ? conversations.filter((c) => matchSearch(c, q)) : conversations

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
        icon={<MessagesSquare size={18} />}
        title="No existen conversaciones."
        description="Aún no se han registrado conversaciones con el asistente."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Mensajes</th>
            <th className="px-4 py-3 font-medium">Última interacción</th>
            <th className="px-4 py-3 font-medium">Feedback</th>
            <th className="px-4 py-3 font-medium">Latencia</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map((conv) => {
            const isSelected = selectedId === conv.id
            return (
              <tr
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/40',
                  isSelected && 'bg-primary/5',
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{conv.id}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{conv.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{conv.message_count}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(conv.last_interaction)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  Nivel 2 — pendiente en backend
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  Nivel 2 — pendiente en backend
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}