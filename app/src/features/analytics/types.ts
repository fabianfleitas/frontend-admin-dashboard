export type Period = 'day' | 'week' | 'month' | 'all'

export interface AnalyticsFilters {
  period: Period
  category: number | ''
  modelo: string
  documentoId: number | null
}

export const DEFAULT_FILTERS: AnalyticsFilters = {
  period: 'all',
  category: '',
  modelo: '',
  documentoId: null,
}

export interface ChartPoint {
  label: string
  value: number
}