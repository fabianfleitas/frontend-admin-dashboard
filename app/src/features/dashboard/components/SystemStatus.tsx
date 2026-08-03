import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/feedback/Skeleton'
import { StatusBadge } from './StatusBadge'

interface SystemStatusProps {
  services?: Record<string, boolean>
  status?: string
  loading?: boolean
}

const SERVICE_LABELS: Record<string, string> = {
  api: 'API',
  database: 'Base de datos',
  db: 'Base de datos',
  storage: 'Storage',
  vector_store: 'Vector Store',
  vectorstore: 'Vector Store',
  whisper: 'Whisper',
  presidio: 'Presidio',
  openrouter: 'OpenRouter',
}

function formatServiceName(key: string): string {
  return SERVICE_LABELS[key.toLowerCase()] ?? key
}

export function SystemStatus({ services, status, loading = false }: SystemStatusProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Estado del sistema
        </h2>
        {loading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <StatusBadge
            label={status === 'ready' ? 'Operativo' : (status ?? 'Desconocido')}
            tone={status === 'ready' ? 'success' : 'warning'}
          />
        )}
      </div>

      {loading ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : !services || Object.keys(services).length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay información de servicios disponible.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {Object.entries(services).map(([key, ok]) => (
            <li
              key={key}
              className="flex items-center justify-between rounded-md border bg-surface px-3 py-2 text-sm"
            >
              <span className="font-medium text-foreground">{formatServiceName(key)}</span>
              {ok ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <CheckCircle2 size={14} aria-hidden />
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-danger">
                  <XCircle size={14} aria-hidden />
                  Offline
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}