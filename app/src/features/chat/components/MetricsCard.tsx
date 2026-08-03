import { Card } from '@/components/common/Card'
import { CircleGauge, Cpu, Timer } from 'lucide-react'
import type { MessageOut } from '../types'

interface MetricsCardProps {
  message: MessageOut | null
}

function formatTokens(value: number | null): string {
  if (value === null) return '—'
  return new Intl.NumberFormat('es').format(value)
}

function formatLatency(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function MetricsCard({ message }: MetricsCardProps) {
  return (
    <Card className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Metric icon={Cpu} label="Modelo" value={message?.modelo_ia ?? '—'} />
      <Metric icon={CircleGauge} label="Tokens in" value={formatTokens(message?.tokens_input ?? null)} />
      <Metric icon={CircleGauge} label="Tokens out" value={formatTokens(message?.tokens_output ?? null)} />
      <Metric icon={Timer} label="Latencia" value={formatLatency(message?.tiempo_respuesta_ms ?? null)} />
    </Card>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon size={12} aria-hidden />
        {label}
      </div>
      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}