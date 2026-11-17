import { Reveal, RevealGroup, RevealItem } from './Reveal'

const PROBLEMS: string[] = [
  'Las consultas más frecuentes se repiten todos los días: calendario académico, fechas de exámenes, matrícula, aranceles y becas.',
  'La atención se reparte entre varios canales —WhatsApp, correo, teléfono y presencial— y la información queda dispersa.',
  'En los períodos de alta demanda se acumulan demoras, tiempos de espera prolongados y respuestas que no siempre son uniformes.',
  'El personal de secretaría termina dedicando su jornada a preguntas que ya están respondidas en un documento.',
]

const SOLUTIONS: string[] = [
  'Una base de conocimiento única con los reglamentos y documentos de tu institución, indexados y versionados.',
  'Respuestas generadas a partir de esa documentación, con el detalle de las fuentes que las respaldan.',
  'Derivación a Secretaría cuando la consulta no está cubierta, en lugar de inventar una respuesta.',
  'Auditoría y métricas para ver qué preguntan los estudiantes y cuándo.',
]

export function ProblemSolutionSection() {
  return (
    <section className="border-b border-line-subtle bg-surface-canvas">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-text-primary">
            Menos consultas repetidas, más tiempo para lo que sí requiere una persona
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Voxia no reemplaza a la secretaría: se hace cargo de lo que ya está documentado y deja el
            resto en manos del equipo.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.12}>
          <RevealItem className="rounded-xl border border-line-subtle bg-surface-raised p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-state-danger">
              El problema
            </h3>
            <ul className="mt-4 space-y-3">
              {PROBLEMS.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-text-secondary">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-state-danger"
                    aria-hidden
                  />
                  {p}
                </li>
              ))}
            </ul>
          </RevealItem>
          <RevealItem className="rounded-xl border border-accent-border bg-accent-subtle/40 p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              La respuesta
            </h3>
            <ul className="mt-4 space-y-3">
              {SOLUTIONS.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-text-primary">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden
                  />
                  {s}
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
