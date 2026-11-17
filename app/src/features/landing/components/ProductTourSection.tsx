import { Upload, MessagesSquare, LayoutDashboard } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

interface Step {
  number: string
  icon: typeof Upload
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: Upload,
    title: 'Cargás la documentación',
    description:
      'Subís los PDFs con reglamentos, calendarios académicos y requisitos. El sistema los procesa, los indexa y los organiza por categorías.',
  },
  {
    number: '02',
    icon: MessagesSquare,
    title: 'El asistente responde con fuentes',
    description:
      'El estudiante consulta por voz o texto y recibe una respuesta construida con esa documentación, junto con el detalle de los fragmentos que la respaldan.',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'El equipo supervisa y audita',
    description:
      'Desde el panel institucional revisás las conversaciones, resolvés las derivaciones pendientes y seguís las métricas de uso y calidad.',
  },
]

export function ProductTourSection() {
  return (
    <section id="tour" className="border-b border-line-subtle bg-surface-canvas">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Cómo funciona, en tres pasos
          </h2>
          <p className="mt-3 text-text-secondary">
            De la carga de documentos a la supervisión del equipo, sin salir del navegador.
          </p>
        </Reveal>

        <RevealGroup as="ol" className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <RevealItem
              as="li"
              key={step.number}
              className="flex flex-col rounded-xl border border-line-subtle bg-surface-raised p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-brand text-sm font-semibold tracking-wide text-brand-primary">
                  {step.number}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary">
                  <step.icon size={18} aria-hidden />
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
