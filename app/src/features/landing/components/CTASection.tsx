import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          ¿Listo para automatizar tu atención académica?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Empieza gratis, sin tarjeta de crédito. En menos de 15 minutos tendrás tu
          asistente respondiendo a tus estudiantes.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = '/login')}
          >
            Empezar ahora
            <ArrowRight size={16} aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  )
}