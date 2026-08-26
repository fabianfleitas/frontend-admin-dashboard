import { useState } from 'react'
import { BarChart3, MessagesSquare, FileText, ThumbsUp, Clock, Target, Gauge, HeartPulse } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { MetricCard } from '@/features/dashboard/components/MetricCard'
import { MetricsIA } from '@/features/dashboard/components/MetricsIA'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Skeleton } from '@/components/feedback/Skeleton'
import { useAnalytics } from '../hooks/useAnalytics'
import { FiltersPanel } from '../components/FiltersPanel'
import { ChartLine } from '../components/ChartLine'
import { ChartBar } from '../components/ChartBar'
import { DEFAULT_FILTERS, type AnalyticsFilters, type ChartPoint } from '../types'

function formatNumber(v: number): string {
  return new Intl.NumberFormat('es').format(v)
}

function formatScore(v: number): string {
  if (!Number.isFinite(v)) return '—'
  return `${Math.round(v * 100)}%`
}

function formatLatency(ms: number): string {
  if (!Number.isFinite(ms)) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS)
  const analyticsQuery = useAnalytics(filters)
  const metrics = analyticsQuery.data

  // Series temporales: usar series entregadas por /api/admin/metrics
  const series = metrics?.series ?? []
  const queriesTrend: ChartPoint[] = series.map((s) => ({ label: s.fecha, value: s.conversaciones }))
  const tokensTrend: ChartPoint[] = series.map((s) => ({ label: s.fecha, value: s.tokens_input + s.tokens_output }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Indicadores operativos y de uso del sistema RAG.
        </p>
      </div>

      <FiltersPanel filters={filters} onChange={setFilters} />

      {analyticsQuery.isError ? (
        <ErrorState
          message="No fue posible obtener las métricas."
          onRetry={() => analyticsQuery.refetch()}
        />
      ) : analyticsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
            </Card>
          ))}
        </div>
      ) : !metrics ? (
        <EmptyState
          icon={<BarChart3 size={18} />}
          title="No existen métricas disponibles."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Consultas" value={formatNumber(metrics.total_queries)} icon={MessagesSquare} />
            <MetricCard label="Conversaciones" value={formatNumber(metrics.total_conversations)} icon={MessagesSquare} />
            <MetricCard label="Documentos" value={formatNumber(metrics.total_documents)} icon={FileText} />
            <MetricCard label="Feedback" value={formatNumber(metrics.total_feedbacks)} icon={ThumbsUp} />
            <MetricCard label="Latencia promedio" value={formatLatency(metrics.avg_response_time)} icon={Clock} />
            <MetricCard label="Fidelidad" value={formatScore(metrics.avg_fidelity)} icon={Target} />
            <MetricCard label="Relevancia" value={formatScore(metrics.avg_relevance)} icon={Gauge} />
            <MetricCard
              label="Estado sistema"
              value={metrics.system_status || '—'}
              icon={HeartPulse}
              tone={metrics.system_status === 'healthy' ? 'default' : 'warning'}
            />
          </section>

          <MetricsIA metrics={metrics} />

          <section className="grid gap-4 lg:grid-cols-2">
            <ChartLine title="Tendencia de consultas" data={queriesTrend} />
            <ChartLine title="Tokens (input + output)" data={tokensTrend} color="#16a34a" />
            <ChartBar title="Documentos más consultados" data={[]} />
            <ChartBar title="Distribución por categoría" data={[]} />
          </section>
        </>
      )}
    </div>
  )
}