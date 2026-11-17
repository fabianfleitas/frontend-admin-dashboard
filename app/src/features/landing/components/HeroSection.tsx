import { useRef } from 'react'
import { ArrowRight, Info, Mic, FileText, UserRoundCheck } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ParallaxBackground } from './ParallaxBackground'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

const RESPONSE_FLOW: { icon: typeof Mic; label: string }[] = [
  { icon: Mic, label: 'Consulta por voz o texto' },
  { icon: FileText, label: 'Respuesta con fuentes de tu documentación' },
  { icon: UserRoundCheck, label: 'Derivación a Secretaría si hace falta' },
]

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative overflow-hidden border-b border-line-subtle bg-surface-canvas"
    >
      <ParallaxBackground targetRef={heroRef} />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-subtle px-3 py-1 text-xs font-medium text-brand-primary">
              <Mic size={14} aria-hidden />
              Asistente de voz y texto para secretarías académicas
            </span>
          </Reveal>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
            Atención académica por voz, con respuestas basadas en tu documentación institucional
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
            Voxia responde consultas de calendario académico, exámenes, matrícula, aranceles y becas
            a partir de los reglamentos y documentos de tu institución. Cuando la consulta necesita
            a una persona, deriva a Secretaría.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="md"
              className="h-11 w-full bg-brand-primary px-6 text-sm text-white hover:bg-brand-primary-hover sm:w-auto"
              onClick={() => (window.location.href = '/solicitar-acceso')}
            >
              Solicitar acceso
              <ArrowRight size={16} aria-hidden />
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="h-11 w-full border-line-default bg-surface-raised px-6 text-sm text-text-primary hover:bg-surface-sunken sm:w-auto"
              onClick={() =>
                document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Ver cómo funciona
            </Button>
          </div>
          <p className="mt-4 text-xs text-text-secondary">
            El acceso se habilita por institución. Funciona en el navegador, sin instalación.
          </p>
        </div>

        <RevealGroup as="ol" className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {RESPONSE_FLOW.map((step) => (
            <RevealItem
              as="li"
              key={step.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-line-subtle bg-surface-raised px-4 py-5 text-center shadow-brand-xs"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary">
                <step.icon size={18} aria-hidden />
              </span>
              <span className="text-sm text-text-secondary">{step.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-text-secondary">
            <Info size={14} aria-hidden />
            Diagnóstico aplicado a 40 personas de secretarías de instituciones privadas de Asunción.{' '}
            <a
              href="#evidencia"
              className="font-medium text-brand-primary underline underline-offset-4"
            >
              Ver los resultados
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
