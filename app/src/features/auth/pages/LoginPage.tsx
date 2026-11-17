import { useState } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, BookOpen, Eye, EyeOff, LogIn, ShieldCheck, UserCheck } from 'lucide-react'
import { signInWithEmailPassword, signInWithGoogle } from '../api/auth.service'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { useSession } from '@/features/auth/hooks/useSession'
import { useValidSession } from '@/features/auth/hooks/useValidSession'
import { AUTH_EMAIL_PASSWORD_ENABLED, AUTH_GOOGLE_ENABLED } from '@/lib/auth-methods'
import { BrandLogo } from '@/components/common/BrandLogo'

const VALORES = [
  {
    icon: BookOpen,
    titulo: 'Respuestas con fuente',
    detalle: 'Cada respuesta se fundamenta en la documentación de la institución.',
  },
  {
    icon: UserCheck,
    titulo: 'Derivación a Secretaría',
    detalle: 'Cuando el caso requiere criterio humano, la conversación se deriva.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Acceso institucional',
    detalle: 'Cada cuenta se habilita desde el panel administrativo de su institución.',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, sessionLoaded } = useSession()
  const { sessionValid, sessionChecked } = useValidSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (sessionLoaded && isAuthenticated && sessionChecked && sessionValid) {
    return <Navigate to={from} replace />
  }

  if (isAuthenticated && !sessionChecked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
        <BrandLogo className="h-8" sloganClassName="text-[10px] leading-none" />
        <div className="text-sm text-muted-foreground" role="status">
          Verificando sesión…
        </div>
      </main>
    )
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      // signInWithOAuth redirige; este código solo corre si la redirección falla.
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible iniciar sesión.')
      setLoading(false)
    }
  }

  async function onSubmit(values: LoginFormValues) {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailPassword(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible iniciar sesión.')
      setLoading(false)
    }
  }

  const showDivider = AUTH_EMAIL_PASSWORD_ENABLED && AUTH_GOOGLE_ENABLED

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-brand-900 px-10 py-12 lg:flex xl:px-16">
        <BrandLogo
          className="h-9"
          inverted
          sloganClassName="vx-slogan--on-dark text-[11px] leading-none"
        />

        <div className="max-w-sm">
          <h2 className="font-brand text-3xl font-bold leading-tight tracking-tight text-white">
            El panel administrativo de Voxia
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-on-dark-secondary">
            La operación de tu institución en un solo lugar: consultas, documentos, conversaciones y
            métricas.
          </p>

          <ul className="mt-10 space-y-6">
            {VALORES.map(({ icon: Icon, titulo, detalle }) => (
              <li key={titulo} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-accent-on-dark">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-medium text-text-on-dark">{titulo}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-text-on-dark-secondary">
                    {detalle}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-text-on-dark-secondary">
          Asistente académico por voz y texto · Proyecto de tesis UNIDA 2026
        </p>
      </section>

      <section className="flex flex-col bg-background px-6 py-12">
        <Link
          to="/"
          className="inline-flex h-8 w-fit items-center gap-2 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={16} aria-hidden />
          Volver al inicio
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <BrandLogo
                className="h-9"
                align="center"
                sloganClassName="text-[11px] leading-none"
              />
            </div>

            <div className="rounded-lg border bg-surface p-8 shadow-sm">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Iniciar sesión
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Acceso al panel administrativo de tu institución
                </p>
              </div>
              {AUTH_EMAIL_PASSWORD_ENABLED && (
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Correo
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="tu.correo@institucion.edu.py"
                    />
                    {errors.email?.message && (
                      <p role="alert" className="text-xs text-danger">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        {...register('password')}
                        className="h-10 w-full rounded-md border border-border bg-surface px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                      </button>
                    </div>
                    {errors.password?.message && (
                      <p role="alert" className="text-xs text-danger">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogIn size={18} aria-hidden />
                    {loading ? 'Ingresando…' : 'Iniciar sesión'}
                  </button>
                </form>
              )}

              {showDivider && (
                <div className="my-6 flex items-center gap-3" aria-hidden>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">o</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}

              {AUTH_GOOGLE_ENABLED && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    AUTH_EMAIL_PASSWORD_ENABLED
                      ? 'border bg-surface text-foreground hover:bg-muted'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <LogIn size={18} aria-hidden />
                  {loading ? 'Redirigiendo…' : 'Iniciar sesión con Google'}
                </button>
              )}

              {!AUTH_EMAIL_PASSWORD_ENABLED && !AUTH_GOOGLE_ENABLED && (
                <p
                  role="alert"
                  className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground"
                >
                  El inicio de sesión no está disponible temporalmente. Contactá al administrador de
                  tu institución.
                </p>
              )}

              {error && (
                <p role="alert" className="mt-4 text-center text-sm text-danger">
                  {error}
                </p>
              )}

              <div className="my-6 flex items-center gap-3" aria-hidden>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">o</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="rounded-md border border-dashed p-4 text-center">
                <p className="text-sm font-medium text-foreground">¿Todavía no tenés cuenta?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  El acceso se habilita por institución. Enviá una solicitud y coordinamos la
                  habilitación con tu institución.
                </p>
                <Link
                  to="/solicitar-acceso"
                  className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Solicitar acceso
                </Link>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Solo cuentas autorizadas por el panel administrativo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
