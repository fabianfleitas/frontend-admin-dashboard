export type Period = 'day' | 'week' | 'month' | 'all'

export interface AnalyticsFilters {
  period: Period
  category: string
  model: string
  document: string
}

export const DEFAULT_FILTERS: AnalyticsFilters = {
  period: 'all',
  category: '',
  model: '',
  document: '',
}

export interface ChartPoint {
  label: string
  value: number
}