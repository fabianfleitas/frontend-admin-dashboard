export type Period = 'day' | 'week' | 'month' | 'all'

export interface AnalyticsFilters {
  period: Period
  category: number | ''
}

export const DEFAULT_FILTERS: AnalyticsFilters = {
  period: 'all',
  category: '',
}

export interface ChartPoint {
  label: string
  value: number
}