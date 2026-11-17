import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { BarChart3 } from 'lucide-react'
import type { ChartPoint } from '../types'

interface ChartBarProps {
  title: string
  data: ChartPoint[]
  color?: string
  emptyMessage?: string
}

export function ChartBar({ title, data, color = 'var(--color-signal-600)', emptyMessage }: ChartBarProps) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {data.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={16} />}
          title="Sin datos disponibles."
          description={emptyMessage ?? 'El backend aún no expone esta métrica agregada.'}
        />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
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
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}