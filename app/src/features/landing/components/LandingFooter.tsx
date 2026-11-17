import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/common/BrandLogo'

export function LandingFooter() {
  return (
    <footer className="border-t border-line-subtle bg-surface-raised">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row md:items-start">
        <div>
          <Link to="/" className="rounded-sm">
            <BrandLogo className="h-7" sloganClassName="text-[10px] leading-none" />
          </Link>
          <p className="mt-3 max-w-xs text-xs text-text-secondary">
            Asistente de voz y texto para secretarías de instituciones de educación superior
            privadas.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-text-secondary">
          <a className="hover:text-text-primary" href="#features">
            Funciones
          </a>
          <a className="hover:text-text-primary" href="#evidencia">
            Evidencia
          </a>
          <a className="hover:text-text-primary" href="#acceso">
            Acceso
          </a>
          <a className="hover:text-text-primary" href="#faq">
            FAQ
          </a>
          <Link className="hover:text-text-primary" to="/terminos">
            Términos y condiciones
          </Link>
        </nav>
        <div className="text-center md:text-right">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Voxia. Todos los derechos reservados.
          </p>
          <p className="mt-1 text-xs text-text-secondary">Asunción, Paraguay</p>
        </div>
      </div>
    </footer>
  )
}
