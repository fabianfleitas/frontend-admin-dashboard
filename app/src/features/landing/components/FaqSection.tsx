import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from './Reveal'

interface QA {
  q: string
  a: string
}

const FAQS: QA[] = [
  {
    q: '¿Qué tipo de consultas puede responder?',
    a: 'Las que están respaldadas por la documentación que cargó la institución: calendarios académicos, fechas de exámenes, matrícula, aranceles, becas, requisitos de inscripción y reglamentos. El MVP se concentró en matrícula y aranceles/becas por ser los trámites de mayor volumen.',
  },
  {
    q: '¿El asistente reemplaza al personal de secretaría?',
    a: 'No. Voxia asume las consultas que ya están documentadas para que el equipo quede disponible para las gestiones que sí requieren criterio o intervención humana. Cuando la consulta no está cubierta, deriva en lugar de inventar una respuesta.',
  },
  {
    q: '¿Qué pasa si el asistente no encuentra la información?',
    a: 'No genera una respuesta sin respaldo. La consulta se deriva a Secretaría, queda registrada y el equipo puede resolverla desde el panel de derivaciones, con el enlace directo a la conversación.',
  },
  {
    q: '¿Cómo se tratan los datos personales?',
    a: 'La cédula y los nombres se anonimizan antes de enviar la consulta a los servicios de IA, y la respuesta se vuelve a mostrar sin esos datos. Además, la información de cada institución se mantiene separada, las sesiones se cierran por inactividad y las acciones administrativas quedan registradas en la auditoría.',
  },
  {
    q: '¿Cuánto cuesta y cómo se contrata?',
    a: 'La suscripción anual se determina por el límite de usuarios de la institución y se publica como valor de referencia en la sección de Planes. La implementación inicial y las integraciones con sistemas institucionales se cotizan por separado, según el alcance. Los importes publicados no son precios de mercado firmes: la propuesta final se acuerda con la institución antes de habilitar el acceso.',
  },
  {
    q: '¿Necesito instalar algo o tener un teléfono asignado?',
    a: 'No. Todo funciona desde el navegador, en computadora o móvil: se usa el micrófono del dispositivo, sin centrales telefónicas ni software adicional.',
  },
  {
    q: '¿Cómo se habilita el acceso?',
    a: 'No hay registro público. El administrador de la institución solicita la habilitación, se crea la cuenta de cada persona y se le asigna su perfil: estudiante, secretaría o administración institucional.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b border-line-subtle bg-surface-raised">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Preguntas frecuentes
          </h2>
          <p className="mt-3 text-center text-text-secondary">
            Lo principal que conviene saber antes de solicitar acceso.
          </p>
        </Reveal>

        <dl className="mt-10 divide-y divide-line-subtle rounded-xl border border-line-subtle bg-surface-canvas">
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
                    <span className="text-sm font-medium text-text-primary">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={
                        'shrink-0 text-text-tertiary transition-transform ' +
                        (isOpen ? 'rotate-180' : '')
                      }
                      aria-hidden
                    />
                  </button>
                </dt>
                {isOpen && <dd className="px-6 pb-4 text-sm text-text-secondary">{item.a}</dd>}
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
