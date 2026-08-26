import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface QA {
  q: string
  a: string
}

const FAQS: QA[] = [
  {
    q: '¿Cómo funciona la prueba gratuita?',
    a: 'Tienes 14 días de acceso completo al plan Pro sin introducir tarjeta de crédito. Al terminar, puedes elegir Free o contratar Pro/Enterprise.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí. Puedes cancelar desde el panel de configuración; el acceso se mantiene hasta el final del periodo facturado.',
  },
  {
    q: '¿Qué tan segura está mi información?',
    a: 'La autenticación se gestiona con Supabase Auth. Los documentos y conversaciones se almacenan en el backend delegado y cada acción queda registrada en la auditoría.',
  },
  {
    q: '¿Cómo se integran mis datos?',
    a: 'Subes tu documentación a la base de conocimiento; el sistema la indexa (RAG) para que el asistente responda citando tus propias fuentes.',
  },
  {
    q: '¿Qué tipo de soporte ofrecen?',
    a: 'Soporte por correo en Free, prioritario en Pro y soporte dedicado con SLA en Enterprise.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
          Preguntas frecuentes
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Resolvemos las dudas más comunes antes de registrarte.
        </p>

        <dl className="mt-10 divide-y rounded-lg border bg-surface">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium text-foreground">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={
                        'shrink-0 text-muted-foreground transition-transform ' +
                        (isOpen ? 'rotate-180' : '')
                      }
                      aria-hidden
                    />
                  </button>
                </dt>
                {isOpen && (
                  <dd className="px-6 pb-4 text-sm text-muted-foreground">{item.a}</dd>
                )}
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}