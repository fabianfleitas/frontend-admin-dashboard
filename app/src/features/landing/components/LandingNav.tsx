import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { BrandLogo } from '@/components/common/BrandLogo'

export function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line-subtle bg-surface-raised/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="rounded-sm">
          <BrandLogo className="h-8" sloganClassName="text-[10px] leading-none" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            href="#features"
          >
            Funciones
          </a>
          <a
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            href="#tour"
          >
            Cómo funciona
          </a>
          <a
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            href="#evidencia"
          >
            Evidencia
          </a>
          <a
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            href="#planes"
          >
            Planes
          </a>
          <a
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            href="#faq"
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/login')}>
            <LogIn size={16} aria-hidden />
            Iniciar sesión
          </Button>
          <Button
            size="sm"
            className="bg-brand-primary text-white hover:bg-brand-primary-hover"
            onClick={() => navigate('/solicitar-acceso')}
          >
            Solicitar acceso
          </Button>
        </div>
      </div>
    </header>
  )
}
