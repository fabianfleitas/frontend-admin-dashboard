import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { signInWithGoogle } from '../api/auth.service'
import { useSession } from '@/features/auth/hooks/useSession'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, sessionLoaded } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (sessionLoaded && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleLogin() {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-lg border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Panel de administración del sistema RAG
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={18} aria-hidden />
          {loading ? 'Redirigiendo…' : 'Iniciar sesión con Google'}
        </button>
        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Solo cuentas autorizadas por el panel administrativo.
        </p>
      </div>
    </main>
  )
}