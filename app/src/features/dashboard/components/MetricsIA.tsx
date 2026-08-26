import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldAlert,
  TriangleAlert,
  CheckCircle2,
  MessageSquareText,
  Clock,
  Timer,
} from 'lucide-react'
import { SectionTitle } from '@/components/common/SectionTitle'
import { MetricCard } from './MetricCard'
import { TokenTable } from './TokenTable'
import type { MetricsOut } from '../types'

function formatNumber(value: number | undefined): string {
  return new Intl.NumberFormat('es').format(value ?? 0)
}

function formatRate(value: number | undefined): string {
  const v = value ?? 0
  return `${(v * 100).toFixed(1)}%`
}

function formatLatency(ms: number | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function MetricsIA({ metrics, loading = false }: { metrics: MetricsOut; loading?: boolean }) {
  return (
    <section className="space-y-3">
      <SectionTitle
        title="Métricas IA"
        description="Consumo y calidad del motor de lenguaje + retrieval (agregados globales)."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tokens de entrada"
          value={formatNumber(metrics.total_tokens_input)}
          icon={ArrowDownToLine}
          loading={loading}
        />
        <MetricCard
          label="Tokens de salida"
          value={formatNumber(metrics.total_tokens_output)}
          icon={ArrowUpFromLine}
          loading={loading}
        />
        <MetricCard
          label="Guard"
          value={formatNumber(metrics.total_guard)}
          icon={ShieldAlert}
          loading={loading}
        />
        <MetricCard
          label="Fallos LLM"
          value={formatNumber(metrics.total_llm_failed)}
          icon={TriangleAlert}
          loading={loading}
        />
        <MetricCard
          label="Tasa de guard"
          value={formatRate(metrics.guard_rate)}
          icon={ShieldAlert}
          hint={`${formatNumber(metrics.total_guard)} de ${formatNumber(metrics.total_llm_responses)} respuestas`}
          loading={loading}
        />
        <MetricCard
          label="Tasa de fallo LLM"
          value={formatRate(metrics.llm_failed_rate)}
          icon={TriangleAlert}
          hint={`${formatNumber(metrics.total_llm_failed)} de ${formatNumber(metrics.total_llm_responses)}`}
          loading={loading}
          tone={metrics.llm_failed_rate > 0.05 ? 'warning' : 'default'}
        />
        <MetricCard
          label="Similitud de retrieval"
          value={formatRate(metrics.avg_retrieval_similarity)}
          icon={CheckCircle2}
          loading={loading}
        />
        <MetricCard
          label="Consultas de voz"
          value={formatNumber(metrics.total_voice_queries)}
          icon={MessageSquareText}
          loading={loading}
        />
        <MetricCard
          label="Consultas de texto"
          value={formatNumber(metrics.total_text_queries)}
          icon={MessageSquareText}
          loading={loading}
        />
        <MetricCard
          label="Latencia de voz"
          value={formatLatency(metrics.avg_response_time_voice)}
          icon={Timer}
          loading={loading}
        />
        <MetricCard
          label="Latencia de texto"
          value={formatLatency(metrics.avg_response_time_text)}
          icon={Clock}
          loading={loading}
        />
        <TokenTable tokensByModel={metrics.tokens_by_model} loading={loading} />
      </div>
    </section>
  )
}