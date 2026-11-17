export interface Plan {
  id: string
  nombre: string
  maxUsuarios: number
  precioAnual: number
  etiqueta?: string
}

export interface Condicion {
  id: string
  concepto: string
  alcance: string
  monto: number
  periodicidad?: string
  nota?: string
}

export const MONEDA = 'Gs.'

export const PLANES: Plan[] = [
  {
    id: 'p-500',
    nombre: 'Hasta 500 usuarios',
    maxUsuarios: 500,
    precioAnual: 26000000,
    etiqueta: 'Plan de entrada',
  },
  { id: 'p-1000', nombre: 'Hasta 1.000 usuarios', maxUsuarios: 1000, precioAnual: 27300000 },
  { id: 'p-2500', nombre: 'Hasta 2.500 usuarios', maxUsuarios: 2500, precioAnual: 31000000 },
  { id: 'p-5000', nombre: 'Hasta 5.000 usuarios', maxUsuarios: 5000, precioAnual: 37200000 },
  { id: 'p-10000', nombre: 'Hasta 10.000 usuarios', maxUsuarios: 10000, precioAnual: 49500000 },
]

export const CONDICIONES: Condicion[] = [
  {
    id: 'implementacion',
    concepto: 'Implementación inicial',
    alcance:
      'Configuración del entorno institucional, parametrización, carga inicial de la documentación, verificación, capacitación básica y puesta en operación.',
    monto: 16000000,
    periodicidad: 'por institución',
  },
  {
    id: 'integracion',
    concepto: 'Integración institucional',
    alcance:
      'Conexión con sistemas existentes de identidad, Active Directory/LDAP, SSO o correo institucional.',
    monto: 8000000,
    periodicidad: 'por integración',
    nota: 'Sujeto al alcance técnico requerido.',
  },
  {
    id: 'consumo-ia',
    concepto: 'Consumo adicional de IA',
    alcance:
      'Se habilita cuando la institución supera la capacidad de uso incluida en el plan que tenga contratado.',
    monto: 1000000,
    periodicidad: 'por unidad',
    nota: 'La unidad de medición (consultas, minutos de voz o uso de procesamiento) y el límite incluido se acordan por contrato.',
  },
]

export const AVISO_REFERENCIA =
  'Estos importes son valores de referencia derivados de la modelización económica del proyecto y no constituyen precios de mercado firmes. El monto final depende del alcance, las integraciones requeridas y las condiciones acordadas con la institución.'

export function formatearGuaranies(monto: number): string {
  return `${MONEDA} ${new Intl.NumberFormat('es-PY').format(monto)}`
}
