import { Check } from 'lucide-react'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mes',
    description: 'Para probar y proyectos pequeños.',
    features: ['1 base de conocimiento', '100 conversaciones/mes', '1 usuario administrador', 'Soporte por correo'],
    cta: 'Empezar gratis',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mes',
    description: 'Para instituciones en crecimiento.',
    features: [
      'Bases de conocimiento ilimitadas',
      '10.000 conversaciones/mes',
      'Hasta 10 usuarios',
      'Auditoría y analítica completa',
      'Soporte prioritario',
    ],
    highlighted: true,
    cta: 'Prueba gratis 14 días',
  },
  {
    name: 'Enterprise',
    price: 'A medida',
    period: '',
    description: 'Para universidades y redes grandes.',
    features: [
      'Conversaciones ilimitadas',
      'Usuarios y roles sin límite',
      'Integraciones a medida',
      'SLA y soporte dedicado',
      'Despliegue privado opcional',
    ],
    cta: 'Contactar',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Precios transparentes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sin sorpresas. No se requiere tarjeta de crédito para empezar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                'relative flex flex-col rounded-lg border bg-background p-6 ' +
                (plan.highlighted ? 'ring-2 ring-primary' : '')
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Más popular
                </span>
              )}
              <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => (window.location.href = '/login')}
                className={
                  'mt-6 inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ' +
                  (plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border bg-surface text-foreground hover:bg-muted')
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Precios en USD. No se requiere tarjeta de crédito para la prueba gratuita.
        </p>
      </div>
    </section>
  )
}