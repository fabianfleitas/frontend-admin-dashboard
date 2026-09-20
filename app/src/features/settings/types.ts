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

export interface SmtpConfigOut {
  institucion_id: number | null
  servidor: string
  puerto: number
  cifrado: string
  usuario: string | null
  correo_remitente: string
  nombre_remitente: string | null
  timeout_segundos: number
  activo: boolean
}

export interface SmtpConfigIn {
  servidor: string
  puerto: number
  cifrado: string
  usuario?: string | null
  password?: string | null
  correo_remitente: string
  nombre_remitente?: string | null
  timeout_segundos: number
  activo: boolean
}

export interface NotificationOut {
  id: number
  institucion_id: number | null
  tipo: string
  canal: string
  destinatario: string
  asunto: string | null
  contenido: string | null
  estado: string
  fecha_programada: string | null
  fecha_envio: string | null
  error: string | null
  created_at: string | null
}

export interface SendTestIn {
  email: string
  asunto?: string | null
  mensaje?: string | null
}