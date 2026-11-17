import { postPublico } from '@/lib/http-publico'
import type { SolicitudAccesoPayload } from '../schemas/solicitud.schema'

export interface SolicitudAccesoOut {
  id: number
  estado: string
  created_at: string | null
}

export function crearSolicitudAcceso(
  payload: SolicitudAccesoPayload,
): Promise<SolicitudAccesoOut> {
  return postPublico<SolicitudAccesoOut>('/public/solicitudes-acceso', { body: payload })
}
