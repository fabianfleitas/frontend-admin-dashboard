import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

export function useSession() {
  const user = useAuthStore((s) => s.user)
  const sessionLoaded = useAuthStore((s) => s.sessionLoaded)
  const setUser = useAuthStore((s) => s.setUser)
  const setSessionLoaded = useAuthStore((s) => s.setSessionLoaded)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setSessionLoaded(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSessionLoaded(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setSessionLoaded])

  return { user, sessionLoaded, isAuthenticated: Boolean(user) }
}