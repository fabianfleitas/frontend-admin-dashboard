export interface PlanOut {
  id: number
  codigo: string | null
  nombre: string
  descripcion: string | null
  precio: number | null
  moneda: string | null
  intervalo: string | null
  max_documentos: number | null
  max_usuarios: number | null
  max_estudiantes: number | null
  features: Record<string, unknown> | null
  activo: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionOut {
  id: number
  institucion_id: number
  plan_id: number
  estado: string | null
  fecha_inicio: string | null
  fecha_vencimiento: string | null
  fecha_cancelacion: string | null
  cancelacion_programada: boolean
  auto_renovacion: boolean
  periodo_prueba_inicio: string | null
  periodo_prueba_fin: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  plan: PlanOut | null
  created_at: string
  updated_at: string
}

export interface PagoOut {
  id: number
  institucion_id: number
  suscripcion_id: number
  importe: number
  moneda: string
  estado: string
  proveedor: string
  descripcion: string | null
  fecha_pago: string
  created_at: string
}

export interface ComprobanteOut {
  id: number
  institucion_id: number
  pago_id: number
  tipo_comprobante: string
  numero: string
  estado: string
  importe: number
  moneda: string
  archivo_path: string | null
  proveedor: string | null
  referencia_externa: string | null
  fecha_emision: string
  created_at: string
}

export interface StripeSubscriptionOut {
  subscription_id: string
  customer_id: string | null
  status: string | null
  cancel_at_period_end: boolean
  current_period_end: string | null
  current_period_start: string | null
  latest_invoice_payment_intent_id: string | null
  latest_invoice_status: string | null
}

export interface CheckoutSessionIn {
  plan_id: number
  success_url?: string
  cancel_url?: string
}

export interface CheckoutSessionOut {
  url: string | null
  session_id: string | null
}

export interface StripePortalSessionIn {
  return_url: string
}

export interface StripePortalSessionOut {
  url: string
  id: string | null
  customer_id: string | null
}

export interface SubscriptionActionOut {
  subscription_id: string
  customer_id: string | null
  status: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
}

export interface SubscriptionCancelIn {
  cancel_at_period_end?: boolean
}

export interface SubscriptionChangePlanIn {
  plan_id: number
}

export interface SubscriptionChangePlanOut {
  subscription_id: string
  customer_id: string | null
  status: string | null
  latest_invoice_payment_intent_id: string | null
  client_secret: string | null
}

export interface StripePlanSyncIn {
  plan_id: number
}

export interface StripePlanSyncOut {
  plan_id: number
  stripe_product_id: string | null
  stripe_price_id: string | null
  stripe_product_created: boolean
  stripe_price_created: boolean
}

export interface SubscriptionHistoryOut {
  id: number
  suscripcion_id: number
  tipo_evento: string | null
  estado_anterior: string | null
  estado_nuevo: string | null
  plan_anterior_id: number | null
  plan_nuevo_id: number | null
  descripcion: string | null
  external_auth_id: string | null
  created_at: string | null
}
