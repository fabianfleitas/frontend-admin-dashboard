import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { TrendingUp } from 'lucide-react'
import type { ChartPoint } from '../types'

interface ChartLineProps {
  title: string
  data: ChartPoint[]
  color?: string
}

export function ChartLine({ title, data, color = 'var(--color-signal-600)' }: ChartLineProps) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {data.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={16} />}
          title="Sin datos de tendencia."
          description="El backend aún no expone series temporales (Nivel 2)."
        />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}