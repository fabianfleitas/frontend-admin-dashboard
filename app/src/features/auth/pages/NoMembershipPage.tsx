import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

export function NoMembershipPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-lg border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
          <ShieldAlert size={24} aria-hidden />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Sin membresía institucional
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tu cuenta está autenticada, pero no tiene una membresía institucional activa
          asociada. Los módulos administrativos están reservados a miembros de una
          institución. Contacta a tu institución o administrador para obtener acceso.
        </p>
        <div className="mt-6">
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            Cerrar sesión
          </Button>
        </div>
      </div>
    </main>
  )
}