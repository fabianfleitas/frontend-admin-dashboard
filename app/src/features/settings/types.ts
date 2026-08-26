export interface ConfigParamOut {
  id: number
  institucion_id: number
  clave: string
  valor: string
  tipo: string
  descripcion: string | null
  editable_desde_dashboard: boolean
  activo: boolean
  created_at: string
  updated_at: string
}

export interface ConfigParamIn {
  clave: string
  valor: string
  tipo?: string
  descripcion?: string | null
}
