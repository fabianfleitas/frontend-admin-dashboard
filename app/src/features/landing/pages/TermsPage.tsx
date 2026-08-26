import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-surface">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/')}>
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Button>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Términos y condiciones
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Esta página está pendiente de contenido. Próximamente se publicarán los términos
          legales, la política de privacidad y las condiciones de uso del servicio.
        </p>
        <div className="mt-8">
          <Button variant="secondary" size="md" onClick={() => (window.location.href = '/')}>
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  )
}