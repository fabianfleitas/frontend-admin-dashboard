import { Eye } from 'lucide-react'
import { Skeleton } from '@/components/feedback/Skeleton'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { DocumentOut, DocumentStatus } from '../types'
import { DocumentStatusBadge } from './DocumentStatusBadge'

interface DocumentsTableProps {
  documents: DocumentOut[]
  loading?: boolean
  onSelect: (documentoId: number) => void
  selectedId?: number | null
}

interface FilterState {
  search?: string
  status?: DocumentStatus | 'INACTIVE' | 'ALL'
}

function filterDocuments(documents: DocumentOut[], filters: FilterState): DocumentOut[] {
  return documents.filter((doc) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matches =
        doc.titulo.toLowerCase().includes(q) ||
        (doc.codigo_documento ?? '').toLowerCase().includes(q) ||
        (doc.descripcion ?? '').toLowerCase().includes(q)
      if (!matches) return false
    }
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'INACTIVE') {
        if (doc.activo) return false
      } else {
        if (!doc.activo) return false
        if (doc.version_activa?.status !== filters.status) return false
      }
    }
    return true
  })
}

interface DocumentsTableWithFiltersProps extends DocumentsTableProps {
  filters: FilterState
}

export function DocumentsTable({
  documents,
  loading = false,
  onSelect,
  selectedId,
  filters,
}: DocumentsTableWithFiltersProps) {
  const filtered = filterDocuments(documents, filters)

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
      <div className="rounded-lg border bg-surface px-4 py-12 text-center text-sm text-muted-foreground">
        No existen documentos que coincidan con los filtros.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Versión</th>
            <th className="px-4 py-3 font-medium">Chunks</th>
            <th className="px-4 py-3 font-medium">Última indexación</th>
            <th className="px-4 py-3 font-medium">Fecha creación</th>
            <th className="px-4 py-3 text-right font-medium">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map((doc) => {
            const activeVersion = doc.version_activa
            const isSelected = selectedId === doc.id
            return (
              <tr
                key={doc.id}
                onClick={() => onSelect(doc.id)}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/40',
                  isSelected && 'bg-primary/5',
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{doc.titulo}</div>
                  {doc.codigo_documento && (
                    <div className="text-xs text-muted-foreground">{doc.codigo_documento}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {doc.categoria_id ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <DocumentStatusBadge
                    status={activeVersion?.status ?? null}
                    activo={doc.activo}
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {activeVersion ? `v${activeVersion.numero_version}` : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {activeVersion?.total_chunks ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(activeVersion?.indexed_at ?? null)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(doc.fecha_creacion)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(doc.id)
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Ver detalle de ${doc.titulo}`}
                  >
                    <Eye size={16} aria-hidden />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}