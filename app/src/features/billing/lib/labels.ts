export const INTERVALO_LABELS: Record<string, string> = {
  MONTH: 'Mes',
  YEAR: 'Año',
}

export function formatIntervalo(intervalo: string | null | undefined): string {
  if (!intervalo) return '—'
  return INTERVALO_LABELS[intervalo.toUpperCase()] ?? intervalo
}

export const ESTADO_SUSCRIPCION_LABELS: Record<string, string> = {
  TRIAL: 'Prueba',
  ACTIVE: 'Activa',
  PENDING_PAYMENT: 'Pago pendiente',
  SUSPENDED: 'Suspendida',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Vencida',
}

export function formatEstadoSuscripcion(estado: string | null | undefined): string {
  if (!estado) return '—'
  return ESTADO_SUSCRIPCION_LABELS[estado.toUpperCase()] ?? estado
}

export const STRIPE_STATUS_LABELS: Record<string, string> = {
  trialing: 'En prueba',
  active: 'Activa',
  past_due: 'Pago vencido',
  unpaid: 'Impaga',
  canceled: 'Cancelada',
  incomplete: 'Incompleta',
  incomplete_expired: 'Incompleta expirada',
  paused: 'Pausada',
}

export function formatStripeStatus(status: string | null | undefined): string {
  if (!status) return '—'
  return STRIPE_STATUS_LABELS[status.toLowerCase()] ?? status
}
