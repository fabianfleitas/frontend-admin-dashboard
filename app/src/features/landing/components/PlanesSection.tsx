import { Building2, Gauge, Info, Mail, Plug, Users } from 'lucide-react'
import { mailtoPropuesta } from '@/lib/contacto'
import { AVISO_REFERENCIA, CONDICIONES, PLANES, formatearGuaranies } from '../data/planes'
import { Reveal, RevealGroup, RevealItem } from './Reveal'

const ICONOS: Record<string, typeof Users> = {
  implementacion: Building2,
  integracion: Plug,
  'consumo-ia': Gauge,
}

export function PlanesSection() {
  const mailto = mailtoPropuesta()

  return (
    <section id="planes" className="border-b border-line-subtle bg-surface-canvas">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Planes y condiciones de contratación
          </h2>
          <p className="mt-3 text-text-secondary">
            La suscripción anual se determina por el límite de usuarios de la institución. La
            implementación y las integraciones se cotizan por separado, según el alcance.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex items-start gap-3 rounded-xl border border-line-subtle bg-surface-raised px-5 py-4">
          <Info size={18} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden />
          <p className="text-sm text-text-secondary">{AVISO_REFERENCIA}</p>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANES.map((plan) => (
            <RevealItem
              key={plan.id}
              className="flex flex-col rounded-xl border border-line-subtle bg-surface-raised p-6"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary"
                  aria-hidden
                >
                  <Users size={20} />
                </span>
                {plan.etiqueta && (
                  <span className="rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-medium text-brand-primary">
                    {plan.etiqueta}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{plan.nombre}</h3>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                {formatearGuaranies(plan.precioAnual)}
              </p>
              <p className="mt-1 text-sm text-text-secondary">por año</p>
              <p className="mt-4 border-t border-line-subtle pt-4 text-sm text-text-secondary">
                Incluye hasta {plan.maxUsuarios.toLocaleString('es-PY')} usuarios, con la capacidad de
                uso de inteligencia artificial definida para el plan.
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <h3 className="text-lg font-semibold text-text-primary">
            Servicios que se cotizan por separado
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Estos cargos son independientes del precio anual del plan y se incorporan según lo que
            la institución requiera.
          </p>
        </Reveal>
        <RevealGroup className="mt-6 grid gap-6 md:grid-cols-3">
          {CONDICIONES.map((c) => {
            const Icono = ICONOS[c.id]
            return (
              <RevealItem
                key={c.id}
                className="flex flex-col rounded-xl border border-line-subtle bg-surface-raised p-6"
              >
                {Icono && (
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand-primary"
                    aria-hidden
                  >
                    <Icono size={20} />
                  </span>
                )}
                <h4 className="mt-4 text-base font-semibold text-text-primary">{c.concepto}</h4>
                <p className="mt-2 text-sm text-text-secondary">{c.alcance}</p>
                <p className="mt-4 text-xl font-semibold text-text-primary">
                  {formatearGuaranies(c.monto)}
                </p>
                {c.periodicidad && <p className="mt-1 text-sm text-text-secondary">{c.periodicidad}</p>}
                {c.nota && <p className="mt-3 text-xs text-text-secondary">{c.nota}</p>}
              </RevealItem>
            )
          })}
        </RevealGroup>

        <Reveal className="mt-12 rounded-xl border border-brand-border bg-brand-subtle px-6 py-8 text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            ¿Necesitás una propuesta para tu institución?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
            Contanos la cantidad de usuarios, la documentación que vas a cargar y las integraciones
            que necesitás, y te devolvemos una propuesta ajustada a ese alcance.
          </p>
          <div className="mt-6 flex justify-center">
            {mailto ? (
              <a
                href={mailto}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                <Mail size={16} aria-hidden />
                Solicitar propuesta
              </a>
            ) : (
              <p className="text-sm text-text-secondary">
                Las condiciones comerciales se coordinan con la institución que solicita la
                habilitación del acceso.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
