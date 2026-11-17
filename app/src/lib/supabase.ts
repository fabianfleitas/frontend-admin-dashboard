import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!url || !anonKey) {
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. El login no funcionará hasta que se configuren.',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Log detallado de sesión/refresh (`#_callRefreshToken`, margen de 90s).
    // Opt-in con VITE_SUPABASE_DEBUG=true; nunca activo en producción.
    debug: import.meta.env.DEV && import.meta.env.VITE_SUPABASE_DEBUG === 'true',
  },
})