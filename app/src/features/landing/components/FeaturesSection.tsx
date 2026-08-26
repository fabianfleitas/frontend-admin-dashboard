import {
  BookOpen,
  MessagesSquare,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface Feature {
  icon: typeof BookOpen
  title: string
  benefit: string
  detail: string
}

const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: 'Base de conocimiento centralizada',
    benefit: 'Tu documentación, indexada y lista para responder.',
    detail:
      'Sube PDFs y documentos; el sistema los indexa, versiona y mantiene disponibles para el asistente de IA.',
  },
  {
    icon: MessagesSquare,
    title: 'Conversaciones supervisadas',
    benefit: 'Cada interacción queda registrada y auditable.',
    detail:
      'Revisa el historial completo de conversaciones, intervene entre sesiones y accede al contexto de cualquier mensaje.',
  },
  {
    icon: BarChart3,
    title: 'Analítica accionable',
    benefit: 'Entiende qué preguntan y cuándo.',
    detail:
      'Métricas de uso por modelo, categoría y periodo para tomar decisiones sobre tu base de conocimiento.',
  },
  {
    icon: ShieldCheck,
    title: 'Auditoría corta y clara',
    benefit: 'Trazabilidad de cada acción administrativa.',
    detail:
      'Registro de cambios en documentos, permisos y configuraciones con vinculación directa a las conversaciones.',
  },
  {
    icon: Sparkles,
    title: 'Playground de IA',
    benefit: 'Prueba prompts y modelos antes de publicar.',
    detail:
      'Experimenta con configuraciones de RAG sin afectar producción y valida respuestas en tiempo real.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Funcionalidades que entregan resultados
          </h2>
          <p className="mt-3 text-muted-foreground">
            No vendemos características técnicas: vendemos menos trabajo manual y mejor
            atención para tus estudiantes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border bg-background p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm font-medium text-primary">{f.benefit}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.detail}</p>
              {/* Espacio reservado para mockup / GIF de la función */}
              <div className="mt-5 aspect-video w-full rounded-md border bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}