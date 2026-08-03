import { Select } from '@/components/forms/Select'
import { SearchBar } from '@/components/common/SearchBar'
import { Info } from 'lucide-react'
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
  return (
    <div className="space-y-3 rounded-lg border bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.period}
          onChange={(v) => onChange({ ...filters, period: v as AnalyticsFilters['period'] })}
          options={PERIOD_OPTIONS}
        />
        <SearchBar
          value={filters.category}
          onChange={(v) => onChange({ ...filters, category: v })}
          placeholder="Categoría…"
        />
        <SearchBar
          value={filters.model}
          onChange={(v) => onChange({ ...filters, model: v })}
          placeholder="Modelo…"
        />
        <SearchBar
          value={filters.document}
          onChange={(v) => onChange({ ...filters, document: v })}
          placeholder="Documento…"
        />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info size={12} aria-hidden />
        Los filtros por periodo/categoría/modelo no son soportados por{' '}
        <code>GET /api/admin/metrics</code> todavía (Nivel 2). Visualmente aplicados sobre los
        agregados disponibles.
      </p>
    </div>
  )
}