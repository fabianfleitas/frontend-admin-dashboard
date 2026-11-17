import { useAuthStore } from '@/stores/auth.store'

/**
 * Lee el estado de sesión. Es un selector puro: la carga inicial y la
 * suscripción a `onAuthStateChange` viven en `<SessionProvider>`, montado una
 * sola vez en la raíz, así que navegar entre secciones no vuelve a dispararlas.
 */
export function useSession() {
  const user = useAuthStore((s) => s.user)
  const sessionLoaded = useAuthStore((s) => s.sessionLoaded)

  return { user, sessionLoaded, isAuthenticated: Boolean(user) }
}