import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Building2, ShieldCheck } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

interface Interface {
  icon: typeof GraduationCap
  audience: string
  description: string
  capabilities: string[]
}

const INTERFACES: Interface[] = [
  {
    icon: GraduationCap,
    audience: 'Estudiantes',
    description:
      'Consultan por voz o texto y evalúan la respuesta, con el detalle de las fuentes que la respaldan.',
    capabilities: [
      'Consulta por voz o texto',
      'Panel de fuentes por respuesta',
      'Retroalimentación de cada respuesta',
    ],
  },
  {
    icon: Building2,
    audience: 'Administración institucional',
    description:
      'El equipo de secretaría gestiona la documentación y supervisa el funcionamiento del asistente.',
    capabilities: [
      'Documentos, categorías y versiones',
      'Conversaciones y derivaciones',
      'Analítica, auditoría y facturación',
    ],
  },
  {
    icon: ShieldCheck,
    audience: 'Administración de plataforma',
    description:
      'La operación global gestiona instituciones, accesos, planes y suscripciones desde una consola única.',
    capabilities: [
      'Instituciones, miembros y usuarios',
      'Planes y suscripciones',
      'Métricas y auditoría globales',
    ],
  },
]

export function AccesoSection() {
  return (
    <section id="acceso" className="border-b border-line-subtle bg-surface-canvas">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Una plataforma, tres interfaces
          </h2>
          <p className="mt-3 text-text-secondary">
            Cada perfil entra a la parte del sistema que le corresponde, con sus permisos y sin
            acceso a la información de otras instituciones.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {INTERFACES.map((item) => (
            <RevealItem
              key={item.audience}
              className="flex flex-col rounded-xl border border-line-subtle bg-surface-raised p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary">
                <item.icon size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{item.audience}</h3>
              <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
              <ul className="mt-5 space-y-2 border-t border-line-subtle pt-5">
                {item.capabilities.map((c) => (
                  <li key={c} className="text-sm text-text-secondary">
                    {c}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 rounded-xl border border-brand-border bg-brand-subtle px-6 py-8 text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            El acceso se habilita por institución
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
            No hay registro público. El administrador de la institución solicita la habilitación, se
            crea la cuenta de cada persona y se asigna su perfil correspondiente. Las condiciones
            comerciales —planes, alcance y facturación— se acordan con la institución antes de
            habilitar el servicio.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/solicitar-acceso"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
            >
              Solicitar acceso
              <ArrowRight size={16} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => (window.location.href = '/login')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line-default bg-surface-raised px-6 text-sm font-medium text-text-primary transition-colors hover:bg-surface-sunken"
            >
              Iniciar sesión
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
