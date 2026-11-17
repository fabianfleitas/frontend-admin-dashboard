import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { ApiError, erroresDeCampo } from '@/lib/http-publico'
import { useCrearSolicitud } from '../hooks/useCrearSolicitud'
import {
  PERFILES_SOLICITADOS,
  solicitudAccesoSchema,
  toSolicitudPayload,
  type SolicitudAccesoFormValues,
} from '../schemas/solicitud.schema'

const inputClass =
  'h-10 w-full rounded-md border border-line-default bg-surface-raised px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none'

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string
  id: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-state-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function SolicitarAccesoPage() {
  const crear = useCrearSolicitud()
  const [enviado, setEnviado] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudAccesoFormValues>({
    resolver: zodResolver(solicitudAccesoSchema),
    defaultValues: { empresa: '', consentimiento: false as unknown as true },
  })

  async function onSubmit(values: SolicitudAccesoFormValues) {
    setErrorGeneral(null)
    try {
      await crear.mutateAsync(toSolicitudPayload(values))
      setEnviado(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        const campos = erroresDeCampo(err)
        let aplicado = false
        for (const [campo, mensaje] of Object.entries(campos)) {
          if (campo in solicitudAccesoSchema.shape) {
            setError(campo as keyof SolicitudAccesoFormValues, { message: mensaje })
            aplicado = true
          }
        }
        if (!aplicado) setErrorGeneral('Revisá los datos del formulario.')
        return
      }
      if (err instanceof ApiError && err.status === 429) {
        setErrorGeneral(
          'Recibimos demasiadas solicitudes desde tu conexión. Esperá un minuto e intentá de nuevo.',
        )
        return
      }
      setErrorGeneral('No pudimos enviar la solicitud. Intentá de nuevo en unos minutos.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-canvas">
      <header className="border-b border-line-subtle bg-surface-raised">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="rounded-sm">
            <BrandLogo className="h-8" sloganClassName="text-[10px] leading-none" />
          </Link>
          <Link
            to="/"
            className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
          >
            <ArrowLeft size={16} aria-hidden />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        {enviado ? (
          <section className="rounded-xl border border-brand-border bg-brand-subtle px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-state-success-subtle text-state-success">
              <CheckCircle2 size={26} aria-hidden />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary">
              Recibimos tu solicitud
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary">
              Vamos a revisar los datos y a coordinar la habilitación con tu institución. Te
              escribimos al correo que dejaste.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                Volver al inicio
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
                Solicitar acceso
              </h1>
              <p className="mt-3 text-text-secondary">
                El acceso se habilita por institución. Contanos quién sos y qué necesitás, y
                coordinamos la habilitación con tu institución.
              </p>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-6 rounded-xl border border-line-subtle bg-surface-canvas p-6"
            >
              <Field
                label="Institución"
                id="institucion_nombre"
                error={errors.institucion_nombre?.message}
              >
                <input
                  id="institucion_nombre"
                  {...register('institucion_nombre')}
                  className={inputClass}
                  placeholder="Ej. Universidad Nacional"
                  autoComplete="organization"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Persona de contacto"
                  id="persona_contacto"
                  error={errors.persona_contacto?.message}
                >
                  <input
                    id="persona_contacto"
                    {...register('persona_contacto')}
                    className={inputClass}
                    autoComplete="name"
                  />
                </Field>

                <Field label="Correo" id="email" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={inputClass}
                    placeholder="contacto@institucion.edu.py"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Teléfono"
                  id="telefono"
                  error={errors.telefono?.message}
                  hint="Opcional"
                >
                  <input
                    id="telefono"
                    {...register('telefono')}
                    className={inputClass}
                    placeholder="+595 981 000 000"
                    autoComplete="tel"
                  />
                </Field>

                <Field
                  label="Usuarios estimados"
                  id="cantidad_usuarios_estimada"
                  error={errors.cantidad_usuarios_estimada?.message}
                  hint="Opcional, un número aproximado"
                >
                  <input
                    id="cantidad_usuarios_estimada"
                    inputMode="numeric"
                    {...register('cantidad_usuarios_estimada')}
                    className={inputClass}
                    placeholder="1200"
                  />
                </Field>
              </div>

              <Field
                label="Perfil que necesitás"
                id="perfil_solicitado"
                error={errors.perfil_solicitado?.message}
                hint="Opcional"
              >
                <select
                  id="perfil_solicitado"
                  {...register('perfil_solicitado')}
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="">Sin definir</option>
                  {PERFILES_SOLICITADOS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Detalle adicional"
                id="mensaje"
                error={errors.mensaje?.message}
                hint="Opcional"
              >
                <textarea
                  id="mensaje"
                  {...register('mensaje')}
                  rows={4}
                  className="w-full rounded-md border border-line-default bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none"
                  placeholder="Documentación a cargar, integraciones requeridas, plazos…"
                />
              </Field>

              <div
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="empresa">No completar este campo</label>
                <input id="empresa" tabIndex={-1} autoComplete="off" {...register('empresa')} />
              </div>

              <div className="border-t border-line-subtle pt-6">
                <label className="flex items-start gap-3 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    {...register('consentimiento')}
                    className="mt-0.5 h-4 w-4 rounded border-line-default"
                  />
                  <span>
                    Autorizo el tratamiento de estos datos para gestionar la solicitud, según los{' '}
                    <Link
                      to="/terminos"
                      className="font-medium text-brand-primary underline underline-offset-4"
                    >
                      términos y condiciones
                    </Link>
                    .
                  </span>
                </label>
                {errors.consentimiento?.message && (
                  <p role="alert" className="mt-2 text-xs text-state-danger">
                    {errors.consentimiento.message}
                  </p>
                )}
              </div>

              {errorGeneral && (
                <p
                  role="alert"
                  className="rounded-md border border-state-danger-subtle bg-state-danger-subtle px-4 py-3 text-sm text-state-danger"
                >
                  {errorGeneral}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
