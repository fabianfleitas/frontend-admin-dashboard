import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { BarChart3 } from 'lucide-react'
import type { ChartPoint } from '../types'

interface ChartBarProps {
  title: string
  data: ChartPoint[]
  color?: string
}

export function ChartBar({ title, data, color = '#4f46e5' }: ChartBarProps) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {data.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={16} />}
          title="Sin datos disponibles."
          description="El backend aún no expone series temporales (Nivel 2)."
        />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 12, fill: '#71717a' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e4e4e7',
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