export interface PlanOut {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  precio: number
  moneda: string
  intervalo: string
  max_documentos: number
  max_usuarios: number
  max_estudiantes: number
  features: string[]
  activo: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionOut {
  id: number
  institucion_id: number
  plan_id: number
  estado: string
  fecha_inicio: string
  fecha_vencimiento: string
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
