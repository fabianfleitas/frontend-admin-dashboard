import { ArrowRight } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { Reveal } from './Reveal'

export function CTASection() {
  return (
    <section className="bg-brand-900 text-white">
      <Reveal className="mx-auto max-w-4xl px-6 py-20 text-center">
        <BrandLogo
          className="h-9"
          sloganClassName="vx-slogan--on-dark text-center text-xs"
          align="center"
          inverted
        />
        <h2 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
          ¿Empezamos con la documentación de tu institución?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          La habilitación se coordina con el administrador de la institución. Una vez creada la
          cuenta, el equipo carga su documentación y el asistente queda disponible para los
          estudiantes.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => (window.location.href = '/login')}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-brand-primary transition-colors hover:bg-surface-canvas sm:w-auto"
          >
            Acceder al panel
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </Reveal>
    </section>
  )
}
