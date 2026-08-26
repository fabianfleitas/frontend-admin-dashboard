import { Select } from '@/components/forms/Select'
import { Info } from 'lucide-react'
import { useCategories } from '@/features/documents/hooks/useCategories'
import type { AnalyticsFilters } from '../types'

interface FiltersPanelProps {
  filters: AnalyticsFilters
  onChange: (filters: AnalyticsFilters) => void
}

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo el periodo' },
  { value: 'day', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
]

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const categoriesQuery = useCategories()
  const catOptions = (categoriesQuery.data?.items ?? []).map((c) => ({
    value: String(c.id),
    label: c.nombre,
  }))

  return (
    <div className="space-y-3 rounded-lg border bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.period}
          onChange={(v) => onChange({ ...filters, period: v as AnalyticsFilters['period'] })}
          options={PERIOD_OPTIONS}
        />
        <Select
          value={String(filters.category)}
          onChange={(v) => onChange({ ...filters, category: v ? Number(v) : '' })}
          options={[{ value: '', label: 'Todas las categorías' }, ...catOptions]}
        />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info size={12} aria-hidden />
        Filtros de periodo y categoría enviados a{' '}
        <code>GET /api/admin/metrics</code>. Filtros de modelo/documento no expuestos (Nivel 2).
      </p>
    </div>
  )
}
