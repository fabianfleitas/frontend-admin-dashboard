import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            IA + RAG para instituciones educativas
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Automatiza la atención a tus estudiantes en minutos con IA.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Centraliza tu base de conocimiento, responde dudas académicas al instante y
            supervisa cada conversación desde un panel pensado para equipos administrativos.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="md" className="w-full sm:w-auto" onClick={() => (window.location.href = '/login')}>
              Empezar ahora
              <ArrowRight size={16} aria-hidden />
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => (window.location.href = '/login')}
            >
              Ver demo
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            No se requiere tarjeta de crédito · Prueba gratuita por 14 días
          </p>
        </div>

        {/* Espacio reservado para captura, GIF o vídeo del producto (15–30 seg) */}
        <div className="mt-14 aspect-video w-full rounded-lg border bg-muted/50 ring-1 ring-border/60">
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Aquí irá una captura o vídeo corto del producto en acción.
          </div>
        </div>
      </div>
    </section>
  )
}