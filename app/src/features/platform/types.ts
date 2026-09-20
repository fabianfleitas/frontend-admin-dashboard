export interface InstitutionOut {
  id: number
  codigo: string | null
  nombre: string
  nombre_comercial: string | null
  ciudad: string | null
  pais: string | null
  direccion: string | null
  email_contacto: string | null
  telefono_contacto: string | null
  activo: boolean
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface MemberOut {
  id: number
  external_auth_id: string
  tipo_miembro: string
  activo: boolean
  fecha_ingreso: string | null
  email: string | null
  full_name: string | null
}

export interface MemberIn {
  external_auth_id: string
  tipo_miembro: string
}


