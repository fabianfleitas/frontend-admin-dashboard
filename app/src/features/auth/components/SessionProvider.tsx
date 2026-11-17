import { type ReactNode, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Única fuente de verdad del estado de sesión de Supabase.
 *
 * Se monta una sola vez en la raíz de la app. Antes cada hook `useSession()`
 * ejecutaba su propio `getSession()` + suscripción, y como `router.tsx` monta
 * un `ProtectedRoute` por ruta, cada navegación relanzaba esa carga y podía
 * disparar `setUser(null)` cuando el refresh del token no se había completado.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const setSessionLoaded = useAuthStore((s) => s.setSessionLoaded)

  useEffect(() => {
    let active = true

    // Carga inicial. Solo se marca `sessionLoaded` una vez resuelta.
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setUser(session?.user ?? null)
      setSessionLoaded(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (import.meta.env.DEV) {
        console.info('[auth] evento:', event, 'userId:', session?.user.id ?? null)
      }
      // Tras la carga inicial, `onAuthStateChange` es la única fuente de verdad
      // para limpiar el usuario: no depende de una lectura de storage puntual.
      setUser(session?.user ?? null)
      setSessionLoaded(true)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [setUser, setSessionLoaded])

  return <>{children}</>
}