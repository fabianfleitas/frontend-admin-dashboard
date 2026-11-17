import { useMutation } from '@tanstack/react-query'
import { crearSolicitudAcceso } from '../api/solicitudes.service'
import type { SolicitudAccesoPayload } from '../schemas/solicitud.schema'

export function useCrearSolicitud() {
  return useMutation({
    mutationFn: (payload: SolicitudAccesoPayload) => crearSolicitudAcceso(payload),
  })
}
