import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bot size={16} aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Admin Dashboard</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#features">Funciones</a>
          <a className="hover:text-foreground" href="#pricing">Precios</a>
          <a className="hover:text-foreground" href="#faq">FAQ</a>
          <Link className="hover:text-foreground" to="/terminos">
            Términos y condiciones
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Admin Dashboard. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}