import { Link } from 'react-router-dom'
import { Bot, LogIn } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot size={18} aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Admin Dashboard
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#features">
            Funciones
          </a>
          <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#tour">
            Recorrido
          </a>
          <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#pricing">
            Precios
          </a>
          <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href="#faq">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/login')}>
            <LogIn size={16} aria-hidden />
            Iniciar sesión
          </Button>
          <Button size="sm" onClick={() => (window.location.href = '/login')}>
            Empezar gratis
          </Button>
        </div>
      </div>
    </header>
  )
}