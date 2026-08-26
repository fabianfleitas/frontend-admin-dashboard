import {
  BarChart3,
  BookOpen,
  Bot,
  Clock,
  FileText,
  Gauge,
  HeartPulse,
  MessagesSquare,
  ShieldCheck,
  Target,
  ThumbsUp,
  Upload,
} from 'lucide-react'
import { SectionTitle } from '@/components/common/SectionTitle'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/Skeleton'
import { Card } from '@/components/common/Card'
import { useAuthStore } from '@/stores/auth.store'
import { useMetrics } from '../hooks/useMetrics'
import { useReady } from '../hooks/useReady'
import { MetricCard } from '../components/MetricCard'
import { MetricsIA } from '../components/MetricsIA'
import { SystemStatus } from '../components/SystemStatus'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { QuickActionCard } from '../components/QuickActionCard'

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es').format(value)
}

function formatLatency(ms: number): string {
  if (!Number.isFinite(ms)) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function formatScore(value: number): string {
  if (!Number.isFinite(value)) return '—'
  // Las puntuaciones de fidelidad/relevancia se muestran como porcentaje 0–100.
  return `${Math.round(value * 100)}%`
}

export function DashboardPage() {
  const metricsQuery = useMetrics()
  const readyQuery = useReady()
  const role = useAuthStore((s) => s.profile?.role)

  const metrics = metricsQuery.data
  const ready = readyQuery.data

  const metricsError = metricsQuery.isError
  const readyError = readyQuery.isError

  const canManageDocuments = role === 'ADMIN' || role === 'STAFF'
  const quickActions = [
    { to: '/documents', label: 'Subir documento', description: 'Knowledge Base', icon: Upload, guard: canManageDocuments },
    { to: '/documents', label: 'Knowledge Base', description: 'Gestionar documentos', icon: BookOpen, guard: canManageDocuments },
    { to: '/playground', label: 'Playground', description: 'Probar asistente IA', icon: Bot, guard: true },
    { to: '/audit', label: 'Auditoría', description: 'Trazabilidad', icon: ShieldCheck, guard: canManageDocuments },
    { to: '/documents', label: 'Reindexar', description: 'Volver a indexar', icon: Upload, guard: canManageDocuments },
  ].filter((a) => a.guard)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del estado del sistema RAG.
        </p>
      </div>

      {/* KPIs */}
      <section className="space-y-3">
        <SectionTitle
          title="Métricas globales"
          description="Los KPIs por periodo son Nivel 2 — pendiente en backend (solo agregados disponibles)."
        />

        {metricsError ? (
          <ErrorState
            message="No fue posible obtener el estado del sistema."
            onRetry={() => metricsQuery.refetch()}
          />
        ) : metricsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="h-9 w-9" />
              </Card>
            ))}
          </div>
        ) : !metrics ? (
          <EmptyState
            icon={<BarChart3 size={18} />}
            title="No existen métricas disponibles."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Consultas"
              value={formatNumber(metrics.total_queries)}
              icon={MessagesSquare}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Conversaciones"
              value={formatNumber(metrics.total_conversations)}
              icon={MessagesSquare}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Documentos activos"
              value={formatNumber(metrics.total_documents)}
              icon={FileText}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Feedback"
              value={formatNumber(metrics.total_feedbacks)}
              icon={ThumbsUp}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Latencia promedio"
              value={formatLatency(metrics.avg_response_time)}
              icon={Clock}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Fidelidad promedio"
              value={formatScore(metrics.avg_fidelity)}
              icon={Target}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Relevancia promedio"
              value={formatScore(metrics.avg_relevance)}
              icon={Gauge}
              loading={metricsQuery.isLoading}
            />
            <MetricCard
              label="Estado del sistema"
              value={metrics.system_status || 'Desconocido'}
              icon={HeartPulse}
              loading={readyQuery.isLoading}
              tone={metrics.system_status === 'healthy' ? 'default' : 'warning'}
            />
          </div>
        )}
      </section>

      {!metricsError && metrics ? <MetricsIA metrics={metrics} loading={false} /> : null}

      {/* Estado del sistema + Actividad reciente */}
      <section className="grid gap-4 lg:grid-cols-2">
        {readyError ? (
          <Card>
            <ErrorState
              message="No fue posible obtener el estado del sistema."
              onRetry={() => readyQuery.refetch()}
            />
          </Card>
        ) : (
          <SystemStatus
            services={ready?.services}
            status={ready?.status}
            loading={readyQuery.isLoading}
          />
        )}
        <ActivityTimeline />
      </section>

      {/* Quick actions */}
      <section className="space-y-3">
        <SectionTitle
          title="Quick Actions"
          description="Accesos directos a las funciones más utilizadas."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.label}
              to={action.to}
              label={action.label}
              description={action.description}
              icon={action.icon}
            />
          ))}
        </div>
      </section>
    </div>
  )
}