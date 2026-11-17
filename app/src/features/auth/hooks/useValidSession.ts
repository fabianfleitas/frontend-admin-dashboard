import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Valida contra el servidor de Supabase que la sesión actual sea realmente
 * válida (no caducada). Evita auto-redirigir a /dashboard con una sesión
 * fantasma que quedó en localStorage tras un 401.
 */
export function useValidSession() {
  const user = useAuthStore((s) => s.user)
  const [sessionValid, setSessionValid] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    if (!user) {
      setSessionValid(false)
      setSessionChecked(true)
      return
    }

    let mounted = true
    setSessionChecked(false)

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!mounted) return
        setSessionValid(Boolean(data.user) && !error)
        setSessionChecked(true)
      })
      .catch(() => {
        if (!mounted) return
        setSessionValid(false)
        setSessionChecked(true)
      })

    return () => {
      mounted = false
    }
  }, [user])

  return { sessionValid, sessionChecked }
}