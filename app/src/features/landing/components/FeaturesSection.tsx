import { Mic, Files, ShieldCheck, UserRoundCheck, BarChart3, FileSearch } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

interface Feature {
  icon: typeof Mic
  title: string
  benefit: string
  detail: string
}

const FEATURES: Feature[] = [
  {
    icon: Mic,
    title: 'Consulta por voz o texto',
    benefit: 'Escribís o hablás tu consulta y recibís la respuesta en el navegador.',
    detail:
      'La consulta de voz se transcribe a texto y la respuesta puede escucharse sintetizada. Funciona sobre navegadores modernos, sin centrales telefónicas externas.',
  },
  {
    icon: FileSearch,
    title: 'Respuestas con fuentes verificables',
    benefit: 'Ves de qué documento y de qué página sale cada respuesta.',
    detail:
      'Cada respuesta se genera con fragmentos de tu documentación institucional y podés abrir el panel de fuentes para comprobar el origen.',
  },
  {
    icon: Files,
    title: 'Base de conocimiento versionada',
    benefit: 'Tus documentos PDF, indexados y con historial de versiones.',
    detail:
      'Subís los PDFs, el sistema los procesa, los indexa y los categoriza. Podés cargar nuevas versiones, reindexar y desactivar los que ya no apliquen.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacidad y aislamiento institucional',
    benefit: 'Los datos personales se anonimizan antes de procesarse.',
    detail:
      'Cédula y nombres se enmascaran antes de enviar la consulta a los servicios de IA, y la información de cada institución se mantiene separada de las demás.',
  },
  {
    icon: UserRoundCheck,
    title: 'Supervisión, derivación y auditoría',
    benefit: 'Cada consulta queda registrada, con responsable y estado.',
    detail:
      'El equipo consulta las conversaciones, resuelve las derivaciones pendientes y revisa el registro de acciones sobre documentos, categorías y facturación.',
  },
  {
    icon: BarChart3,
    title: 'Analítica y control de calidad',
    benefit: 'Métricas por período, categoría y modelo.',
    detail:
      'Consultas totales, tiempos de respuesta, uso de cada documento y puntuaciones de fidelidad y relevancia por respuesta, con exportación a CSV.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-line-subtle bg-surface-raised">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Lo que el sistema hace, en concreto
          </h2>
          <p className="mt-3 text-text-secondary">
            Cada punto corresponde a una funcionalidad implementada y verificable, no a una promesa
            de roadmap.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <RevealItem
              key={f.title}
              className="flex flex-col rounded-xl border border-line-subtle bg-surface-canvas p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary">
                <f.icon size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm font-medium text-brand-primary">{f.benefit}</p>
              <p className="mt-2 text-sm text-text-secondary">{f.detail}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
