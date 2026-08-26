interface Step {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Conecta tu cuenta',
    description:
      'Inicia sesión con Google y carga la documentación académica que será tu base de conocimiento.',
  },
  {
    number: '02',
    title: 'Configura tu flujo',
    description:
      'Indexa documentos, ajusta modelos y prueba respuestas en el playground de IA antes de publicar.',
  },
  {
    number: '03',
    title: 'Obtén resultados',
    description:
      'El asistente responde a tus estudiantes y tú monitorizas métricas, conversaciones y auditoría.',
  },
]

export function ProductTourSection() {
  return (
    <section id="tour" className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Cómo funciona, en tres pasos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Ve el producto en acción antes de registrarte. De la carga a la supervisión en minutos.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="relative rounded-lg border bg-surface p-6">
              <span className="text-sm font-semibold text-primary">{step.number}</span>
              <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              {/* Espacio para captura del paso */}
              <div className="mt-5 aspect-video w-full rounded-md border bg-muted/40" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}