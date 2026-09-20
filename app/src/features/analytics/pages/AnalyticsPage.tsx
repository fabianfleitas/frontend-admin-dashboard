import { useState } from 'react'
import { BarChart3, MessagesSquare, FileText, ThumbsUp, Clock, Target, Gauge, HeartPulse, Download } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { exportCsv } from '@/lib/download'
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
import { useDocuments } from '@/features/documents/hooks/useDocuments'
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
  const documentsQuery = useDocuments({ limit: 100 })
  const metrics = analyticsQuery.data

  // Series temporales: usar series entregadas por /api/admin/metrics
  const series = metrics?.series ?? []
  const queriesTrend: ChartPoint[] = series.map((s) => ({ label: s.fecha, value: s.conversaciones }))
  const tokensTrend: ChartPoint[] = series.map((s) => ({ label: s.fecha, value: s.tokens_input + s.tokens_output }))

  // Opciones de filtro: modelos con consumo reportado + documentos existentes
  const modelOptions = Object.keys(metrics?.tokens_by_model ?? {}).map((m) => ({
    value: m,
    label: m,
  }))
  const documentOptions = (documentsQuery.data?.items ?? []).map((d) => ({
    value: String(d.id),
    label: d.titulo,
  }))

  // Tokens por modelo (agregados por /api/admin/metrics)
  const tokensByModelChart: ChartPoint[] = Object.entries(metrics?.tokens_by_model ?? {})
    .map(([model, breakdown]) => ({
      label: model.split('/').pop() ?? model,
      value: Object.values(breakdown ?? {}).reduce((a, b) => a + (Number(b) || 0), 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Documentos más consultados y distribución por categoría (agregados por /api/admin/metrics)
  const topDocumentsChart: ChartPoint[] = (metrics?.top_documents ?? []).map((d) => ({
    label: d.titulo ?? `#${d.documento_id}`,
    value: d.consultas,
  }))
  const byCategoryChart: ChartPoint[] = (metrics?.documents_by_category ?? []).map((c) => ({
    label: c.nombre ?? 'Sin categoría',
    value: c.consultas,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Indicadores operativos y de uso del sistema RAG.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void exportCsv('/api/admin/metrics/export', 'metrics.csv')}>
          <Download size={14} aria-hidden /> Exportar CSV
        </Button>
      </div>

      <FiltersPanel
        filters={filters}
        onChange={setFilters}
        modelOptions={modelOptions}
        documentOptions={documentOptions}
      />

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
            <ChartBar title="Tokens por modelo" data={tokensByModelChart} color="#0ea5e9" />
            <ChartBar
              title="Documentos más consultados"
              data={topDocumentsChart}
              color="#0ea5e9"
              emptyMessage="Aún no hay documentos consultados para los filtros seleccionados."
            />
            <ChartBar
              title="Distribución por categoría"
              data={byCategoryChart}
              color="#8b5cf6"
              emptyMessage="Aún no hay consultas por categoría para los filtros seleccionados."
            />
          </section>
        </>
      )}
    </div>
  )
}