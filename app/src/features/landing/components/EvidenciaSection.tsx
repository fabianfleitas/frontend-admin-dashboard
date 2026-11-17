import { Reveal, RevealGroup, RevealItem } from './Reveal'

interface Stat {
  value: string
  label: string
  source: string
}

const STATS: Stat[] = [
  {
    value: '87,5 %',
    label: 'atiende al menos 20 consultas en un día laboral promedio',
    source: '35 de 40 respuestas',
  },
  {
    value: '74,4 %',
    label: 'estima que al menos el 41 % de las consultas son repetitivas o documentables',
    source: '29 de 39 respuestas estimables',
  },
  {
    value: '4,17 / 5',
    label: 'confianza en una herramienta que use solo documentación oficial',
    source: '33 de 40 respuestas',
  },
  {
    value: '4,53 / 5',
    label: 'protección de datos personales considerada importante',
    source: '36 de 40 respuestas',
  },
]

export function EvidenciaSection() {
  return (
    <section id="evidencia" className="border-b border-line-subtle bg-surface-raised">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-accent-border bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
            Diagnóstico con 40 personas de secretarías
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
            El problema, medido antes de construir la solución
          </h2>
          <p className="mt-3 text-text-secondary">
            Antes de desarrollar el sistema se aplicó un cuestionario a personal de secretarías de
            instituciones de educación superior privadas de Asunción. Estos son los resultados que
            justifican el enfoque.
          </p>
        </Reveal>

        <RevealGroup as="dl" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <RevealItem
              as="div"
              key={stat.value + stat.label}
              className="flex flex-col rounded-xl border border-line-subtle bg-surface-canvas p-6"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-brand text-3xl font-semibold tracking-tight text-brand-primary">
                {stat.value}
              </dd>
              <p className="mt-3 flex-1 text-sm text-text-secondary">{stat.label}</p>
              <p className="mt-4 text-xs text-text-secondary">{stat.source}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 rounded-xl border border-line-subtle bg-surface-sunken px-5 py-4 text-sm text-text-secondary">
          <strong className="font-semibold text-text-primary">Cómo leer estos datos:</strong> son
          percepciones y condiciones declaradas por los participantes del diagnóstico. No son
          mediciones del desempeño del sistema: la verificación técnica de la precisión de las
          respuestas se realiza aparte, sobre un conjunto de consultas de prueba.
        </p>
      </div>
    </section>
  )
}
