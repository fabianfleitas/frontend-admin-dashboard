import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { Breadcrumb } from './Breadcrumb'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  const initials = (user?.email ?? '?').slice(0, 2).toUpperCase()
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
              {initials}
            </span>
          )}
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {user?.email}
          </span>
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