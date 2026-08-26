const PROBLEMS: string[] = [
  'Miles de dudas repetidas saturan a secretaría y docentes.',
  'La información académica está dispersa en PDFs, mails y carpetas.',
  'No hay visibilidad sobre qué preguntan los estudiantes ni cuándo.',
]

const SOLUTIONS: string[] = [
  'Un asistente de IA responde al instante usando tu propia documentación (RAG).',
  'Una sola base de conocimiento indexada, versionada y buscable.',
  'Conversaciones y métricas centralizadas para auditar y mejorar.',
]

export function ProblemSolutionSection() {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
          Del caos a respuestas inmediatas
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Cambiamos el problema operativo por un sistema controlado y trazable.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-surface p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-danger">
              El problema
            </h3>
            <ul className="mt-4 space-y-3">
              {PROBLEMS.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border bg-surface p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-success">
              La solución
            </h3>
            <ul className="mt-4 space-y-3">
              {SOLUTIONS.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}