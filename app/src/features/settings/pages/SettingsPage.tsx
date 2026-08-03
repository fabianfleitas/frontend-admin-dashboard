import { useReady } from '@/features/dashboard/hooks/useReady'
import { useMetrics } from '@/features/dashboard/hooks/useMetrics'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import {
  AlertTriangle,
  Cpu,
  Database,
  HardDrive,
  Layers,
  ServerCog,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SettingRow {
  label: string
  value: string
}

function SettingRowItem({ label, value }: SettingRow) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

interface PendingBlockProps {
  title: string
  description: string
  icon: typeof Cpu
}

function PendingBlock({ title, description, icon: Icon }: PendingBlockProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon size={14} aria-hidden />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <SettingRowItem label="Configuración" value="—" />
      <div className="flex items-start gap-2 rounded-md border border-dashed border-warning/40 bg-warning/5 px-3 py-2 text-xs text-muted-foreground">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" aria-hidden />
        <span>
          {description} Pendiente en backend (Nivel 2). El backend no expone un endpoint para
          consultar estos parámetros.
        </span>
      </div>
    </Card>
  )
}

export function SettingsPage() {
  const readyQuery = useReady()
  const metricsQuery = useMetrics()

  const ready = readyQuery.data
  const metrics = metricsQuery.data
  const loading = readyQuery.isLoading || metricsQuery.isLoading
  const isError = readyQuery.isError || metricsQuery.isError

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información técnica del sistema en modo solo lectura (MVP).
        </p>
      </div>

      {isError ? (
        <ErrorState
          message="No fue posible obtener la información del sistema."
          onRetry={() => {
            void readyQuery.refetch()
            void metricsQuery.refetch()
          }}
        />
      ) : (
        <>
          <Card className="space-y-3">
            <SectionTitle
              title="Estado del sistema"
              description="Origen: GET /ready + GET /api/admin/metrics"
            />
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <SettingRowItem
                  label="Estado global"
                  value={ready?.status ?? metrics?.system_status ?? 'Desconocido'}
                />
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-0">
                  <span className="text-sm text-muted-foreground">Servicios</span>
                  <StatusBadge
                    label={ready?.status === 'ready' ? 'Operativo' : 'Con limitaciones'}
                    tone={ready?.status === 'ready' ? 'success' : 'warning'}
                  />
                </div>
                {ready?.services &&
                  Object.entries(ready.services).map(([key, ok]) => (
                    <SettingRowItem
                      key={key}
                      label={key}
                      value={ok ? 'Online' : 'Offline'}
                    />
                  ))}
              </>
            )}
          </Card>

          <Card className="space-y-3">
            <SectionTitle
              title="Agregados del sistema"
              description="Origen: GET /api/admin/metrics"
            />
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <SettingRowItem
                  label="Total consultas"
                  value={String(metrics?.total_queries ?? '—')}
                />
                <SettingRowItem
                  label="Total conversaciones"
                  value={String(metrics?.total_conversations ?? '—')}
                />
                <SettingRowItem
                  label="Total documentos"
                  value={String(metrics?.total_documents ?? '—')}
                />
                <SettingRowItem
                  label="Total feedbacks"
                  value={String(metrics?.total_feedbacks ?? '—')}
                />
                <SettingRowItem
                  label="Fecha consulta"
                  value={formatDate(new Date().toISOString())}
                />
              </>
            )}
          </Card>

          <section className="space-y-3">
            <SectionTitle
              title="Configuración del sistema"
              description="Bloques pendientes de endpoint en el backend."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <PendingBlock
                title="Modelo LLM"
                description="Configuración del modelo de lenguaje (proveedor, temperatura, max tokens)."
                icon={ServerCog}
              />
              <PendingBlock
                title="Embedding Model"
                description="Modelo de embeddings utilizado para indexación semántica."
                icon={Cpu}
              />
              <PendingBlock
                title="Storage"
                description="Configuración del almacenamiento de archivos (Supabase Storage)."
                icon={HardDrive}
              />
              <PendingBlock
                title="Vector Store"
                description="Configuración del almacén vectorial (pgvector / Pinecone)."
                icon={Layers}
              />
              <PendingBlock
                title="Base de datos"
                description="Parámetros de conexión a PostgreSQL."
                icon={Database}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}