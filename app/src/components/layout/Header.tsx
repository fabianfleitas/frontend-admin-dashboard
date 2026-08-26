import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { memberTypeLabel } from '@/lib/roles'
import { Breadcrumb } from './Breadcrumb'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.email || 'Usuario'
  const initial = (displayName || '?').slice(0, 1).toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-surface px-6">
      <Breadcrumb />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden
            >
              {initial}
            </span>
          )}
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {displayName}
          </span>
          {profile?.tipo_miembro && (
            <span className="hidden rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline-flex">
              {memberTypeLabel(profile.tipo_miembro)}
            </span>
          )}
          {profile?.is_platform_admin && (
            <span className="hidden rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary sm:inline-flex">
              Platform Admin
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}