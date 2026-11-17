import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const LABELS: Record<string, string> = {
  dashboard: 'Panel',
  documents: 'Base de conocimiento',
  playground: 'Agente de IA',
  conversations: 'Conversaciones',
  analytics: 'Analítica',
  audit: 'Auditoría',
  users: 'Usuarios',
  settings: 'Configuración',
  feedback: 'Retroalimentación',
  escalamientos: 'Derivaciones',
  billing: 'Facturación',
  institution: 'Institución',
  platform: 'Plataforma',
}

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((seg, idx) => {
    const isLast = idx === segments.length - 1
    const path = `/${segments.slice(0, idx + 1).join('/')}`
    const label = LABELS[seg] ?? decodeURIComponent(seg)
    return { label, path, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <ol className="flex items-center gap-1.5">
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            {crumb.isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
            {!crumb.isLast && (
              <ChevronRight size={14} className="text-muted-foreground" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}