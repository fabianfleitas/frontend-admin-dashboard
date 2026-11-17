import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { useIdleTimeout } from '@/features/auth/hooks/useIdleTimeout'

const IDLE_MINUTES = Number(import.meta.env.VITE_SESSION_IDLE_MINUTES ?? 30)
const IDLE_MS = Number.isFinite(IDLE_MINUTES) && IDLE_MINUTES > 0 ? IDLE_MINUTES * 60_000 : 0

const WARNING_SECONDS = Number(import.meta.env.VITE_SESSION_WARNING_SECONDS ?? 60)
const WARN_MS =
  Number.isFinite(WARNING_SECONDS) && WARNING_SECONDS > 0 ? WARNING_SECONDS * 1000 : 0

/**
 * Cierra la sesión por inactividad (S7) y muestra un aviso previo con la opción
 * de continuar. Sin actividad durante `VITE_SESSION_IDLE_MINUTES` (default 30),
 * firma fuera de Supabase y redirige a /login. `VITE_SESSION_WARNING_SECONDS`
 * (default 60) define cuánto antes se muestra el aviso.
 */
export function SessionIdleWatcher() {
  const [active, setActive] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleTimeout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      window.location.assign('/login')
    }
  }, [])

  const handleWarning = useCallback(() => setShowWarning(true), [])

  const { reset } = useIdleTimeout(
    active && IDLE_MS > 0,
    IDLE_MS,
    handleTimeout,
    WARN_MS,
    handleWarning,
  )

  const continueSession = useCallback(() => {
    setShowWarning(false)
    reset()
  }, [reset])

  useEffect(() => {
    let mounted = true
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setActive(Boolean(data.session))
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Modal
      open={showWarning}
      onClose={() => setShowWarning(false)}
      title="Tu sesión está por expirar"
      description="La sesión cerrará por inactividad."
      size="sm"
      footer={
        <Button variant="secondary" onClick={continueSession}>
          Continuar sesión
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        Para seguir usando la plataforma sin interrupciones, haz clic en{' '}
        <span className="font-medium text-foreground">Continuar sesión</span>.
      </p>
    </Modal>
  )
}