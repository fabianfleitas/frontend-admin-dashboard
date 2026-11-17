export const CONTACTO_EMAIL = (import.meta.env.VITE_CONTACTO_EMAIL ?? '').trim()

interface MailtoInput {
  subject: string
  body: string
  email?: string
}

export function buildMailto({
  subject,
  body,
  email = CONTACTO_EMAIL,
}: MailtoInput): string | null {
  const destino = email.trim()
  if (!destino) return null
  return `mailto:${destino}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function mailtoPropuesta(email?: string): string | null {
  return buildMailto({
    subject: 'Solicitud de propuesta para Voxia',
    body: [
      'Institución:',
      'Cantidad estimada de usuarios:',
      'Documentación a cargar:',
      'Integraciones requeridas:',
      '',
      'Detalle adicional:',
    ].join('\n'),
    email,
  })
}
