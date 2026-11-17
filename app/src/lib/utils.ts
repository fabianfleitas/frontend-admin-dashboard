import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('es-PY').format(value)
}

export function formatMoney(value: number | null | undefined, moneda?: string | null): string {
  if (value === null || value === undefined) return '—'
  const code = (moneda ?? '').toUpperCase()
  const symbol = code === 'PYG' ? 'Gs.' : code
  const formatted = new Intl.NumberFormat('es-PY').format(value)
  return symbol ? `${symbol} ${formatted}` : formatted
}