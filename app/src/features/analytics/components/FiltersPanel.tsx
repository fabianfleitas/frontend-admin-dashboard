import { Select } from '@/components/forms/Select'
import { Info } from 'lucide-react'
import { useCategories } from '@/features/documents/hooks/useCategories'
import type { AnalyticsFilters } from '../types'

interface FiltersPanelProps {
  filters: AnalyticsFilters
  onChange: (filters: AnalyticsFilters) => void
}

interface FilterOptions {
  value: string
  label: string
}

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo el periodo' },
  { value: 'day', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
]

export function FiltersPanel({
  filters,
  onChange,
  modelOptions = [],
  documentOptions = [],
}: FiltersPanelProps & { modelOptions?: FilterOptions[]; documentOptions?: FilterOptions[] }) {
  const categoriesQuery = useCategories()
  const catOptions = (categoriesQuery.data?.items ?? [])
    .filter((c) => c.activo)
    .map((c) => ({
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
        <Select
          value={filters.modelo}
          onChange={(v) => onChange({ ...filters, modelo: v })}
          options={modelOptions}
          placeholder="Todos los modelos"
          aria-label="Filtrar por modelo"
        />
        <Select
          value={filters.documentoId == null ? '' : String(filters.documentoId)}
          onChange={(v) => onChange({ ...filters, documentoId: v ? Number(v) : null })}
          options={documentOptions}
          placeholder="Todos los documentos"
          aria-label="Filtrar por documento"
        />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info size={12} aria-hidden />
        Filtros de periodo, categoría, modelo y documento enviados a{' '}
        <code>GET /api/admin/metrics</code>.
      </p>
    </div>
  )
}