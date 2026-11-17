import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'

const SECTIONS = [
  {
    id: 'aceptacion',
    title: '1. Aceptación y definiciones',
    body: [
      'Al acceder o utilizar el servicio, aceptas estos términos y condiciones. Si representas a una institución, declaras contar con autorización para aceptarlos en su nombre.',
      'Por "servicio" se entiende Voxia, la plataforma de gestión documental y asistencia por voz y texto con recuperación de información sobre documentación institucional (RAG). Por "usuario" se entiende toda persona con una cuenta autenticada.',
      'El acceso al servicio no es público: la habilitación de una cuenta y la asignación de su perfil son decisiones de la institución contratante.',
    ],
  },
  {
    id: 'uso',
    title: '2. Uso del servicio',
    body: [
      'El servicio está destinado a uso institucional legítimo: gestión de documentos, consultas del asistente y análisis de métricas. No está permitido:',
    ],
    list: [
      '- Utilizar el servicio para fines ilícitos o contrarios a la normativa aplicable.',
      '- Intentar acceder a documentos, conversaciones o datos de otra institución.',
      '- Subir contenidos que infrinjan derechos de terceros o contengan información personal sensible sin la debida autorización.',
      '- Realizar pruebas automatizadas, extracción masiva de datos o uso que degrade la disponibilidad del servicio.',
    ],
  },
  {
    id: 'cuentas',
    title: '3. Cuentas y membresías',
    body: [
      'El acceso se gestiona mediante autenticación segura (Supabase Auth). Cada usuario pertenece a una institución y tiene un tipo de miembro (administrador, secretaría o estudiante) que determina los permisos disponibles.',
      'Los datos de una institución están aislados del resto (aislamiento por institución). Ningún usuario puede acceder a información de otra institución, incluyendo los administradores de plataforma, salvo en los supuestos expresamente previstos.',
      'Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad realizada con tu cuenta.',
    ],
  },
  {
    id: 'privacidad',
    title: '4. Privacidad y protección de datos',
    body: [
      'El servicio procesa únicamente los datos necesarios para su funcionamiento: documentos cargados, consultas y respuestas del asistente, métricas de uso y datos básicos de la cuenta.',
      'Las consultas y documentos se tratan como información institucional. No se comparten entre instituciones ni se utilizan para otros fines distintos de la prestación del servicio.',
      'Cuando el contenido incluye datos personales, la institución es responsable de contar con la base de legitimación correspondiente. El servicio anonimiza la información de identificación personal antes de enviar las consultas a servicios de IA externos.',
      'El servicio se presta sobre una base institucional. No se ofrece un registro público: la habilitación de cada cuenta y la asignación de su perfil son decisiones de la institución contratante.',
    ],
  },
  {
    id: 'precios',
    title: '5. Precios y condiciones comerciales',
    body: [
      'El sitio publica importes anuales de referencia por tramo de límite de usuarios, así como los cargos correspondientes a la implementación inicial y a las integraciones institucionales. Dichos importes se presentan a efectos informativos y no constituyen una oferta ni precios de mercado firmes.',
      'El precio aplicable a cada institución se determina en función del alcance contratado, las integraciones requeridas y el consumo de servicios de inteligencia artificial, y se formaliza antes de habilitar el acceso al servicio.',
      'La publicación de importes en el sitio no implica obligación de facturación por parte del solicitante ni genera derecho de servicio sin laFormalización de las condiciones acordadas.',
    ],
  },
  {
    id: 'pagos',
    title: '6. Pagos y suscripciones',
    body: [
      'Los planes de suscripción se facturan a través del proveedor de pagos (Stripe). El procesamiento de pagos se rige por los términos del proveedor.',
      'La cancelación o reactivación de una suscripción se realiza desde el portal de pago institucional. La vigencia del plan se mantiene según el periodo contratado.',
      'El incumplimiento de pago puede limitar el acceso hasta regularizar la situación.',
    ],
  },
  {
    id: 'propiedad',
    title: '7. Propiedad intelectual',
    body: [
      'La plataforma, su diseño y su código son propiedad del titular del servicio o de sus licenciantes.',
      'Los documentos cargados por una institución siguen siendo de su titularidad. Al cargarlos, otorgas una licencia limitada para su procesamiento técnico dentro del servicio.',
    ],
  },
  {
    id: 'responsabilidad',
    title: '8. Limitación de responsabilidad',
    body: [
      'El asistente genera respuestas automáticas a partir de la información cargada y de modelos de lenguaje. Las respuestas pueden contener errores y no constituyen asesoramiento profesional.',
      'El servicio se presta "tal cual". No se garantiza disponibilidad ininterrumpida ni la exactitud de las respuestas generadas.',
      'En la medida permitida por la ley, el proveedor no será responsable por daños indirectos derivados del uso del servicio.',
    ],
  },
  {
    id: 'modificaciones',
    title: '9. Modificaciones de los términos',
    body: [
      'Estos términos pueden actualizarse para reflejar cambios del servicio o requisitos normativos. La versión vigente se publicará en esta página junto con su fecha de actualización.',
      'El uso continuado del servicio tras una actualización implica la aceptación de los nuevos términos.',
    ],
  },
  {
    id: 'contacto',
    title: '10. Contacto',
    body: [
      'Para consultas sobre estos términos, la privacidad o los datos, contacta con el responsable del servicio a través del canal que tu institución haya acordado al habilitar el acceso.',
    ],
  },
]

export function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-canvas">
      <header className="border-b border-line-subtle bg-surface-raised">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary"
            onClick={() => (window.location.href = '/')}
          >
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <section className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Términos y condiciones
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Última actualización: 4 de octubre de 2026
          </p>
        </section>

        {SECTIONS.map((section) => (
          <section key={section.id} className="border-b border-line-subtle py-6 first:border-t">
            <h2 className="text-base font-semibold text-text-primary">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-text-secondary">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-1.5 pl-4">
                  {section.list.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <p className="mt-8 text-xs text-text-secondary">
          Este documento es un borrador genérico pendiente de revisión legal y no constituye
          asesoría jurídica.
        </p>

        <div className="mt-8">
          <Button
            variant="secondary"
            size="md"
            className="border-line-default bg-surface-raised text-text-primary hover:bg-surface-sunken"
            onClick={() => (window.location.href = '/')}
          >
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  )
}
