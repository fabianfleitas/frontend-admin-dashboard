import { History } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { DocumentVersionOut } from '../types'
import { cn } from '@/lib/utils'

interface VersionTimelineProps {
  versions: DocumentVersionOut[]
}

const STATUS_LABELS: Record<string, string> = {
  READY: 'Lista',
  PROCESSING: 'Procesando',
  PENDING: 'Pendiente',
  FAILED: 'Fallida',
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay versiones registradas para este documento.
      </p>
    )
  }

  const sorted = [...versions].sort((a, b) => b.numero_version - a.numero_version)

  return (
    <ol className="relative space-y-4 pl-6" aria-label="Historial de versiones">
      <span
        className="absolute top-1 bottom-1 left-2 w-px bg-border"
        aria-hidden
      />
      {sorted.map((version) => (
        <li key={version.id} className="relative">
          <span
            className={cn(
              'absolute -left-[1.45rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 bg-surface',
              version.es_version_activa
                ? 'border-primary'
                : version.status === 'FAILED'
                  ? 'border-danger'
                  : 'border-border',
            )}
            aria-hidden
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              v{version.numero_version}
            </span>
            {version.es_version_activa && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Activa
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {STATUS_LABELS[version.status] ?? version.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(version.fecha_carga)} · {version.total_chunks} chunks
            {version.embedding_model ? ` · ${version.embedding_model}` : ''}
          </p>
          {version.indexed_at && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <History size={12} aria-hidden />
              Indexada: {formatDate(version.indexed_at)}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}