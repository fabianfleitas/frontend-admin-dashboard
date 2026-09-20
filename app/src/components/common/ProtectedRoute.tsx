import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/features/auth/hooks/useSession'
import { useMe } from '@/features/auth/hooks/useMe'
import { toast } from '@/stores/toast.store'

export type RouteGuard = 'authenticated' | 'member' | 'staff' | 'admin' | 'platform'

interface ProtectedRouteProps {
  children: ReactNode
  guard?: RouteGuard
}

function evaluateGuard(
  guard: RouteGuard,
  caps: { hasMembership: boolean; isStaff: boolean; isAdmin: boolean; isPlatformAdmin: boolean },
): boolean {
  if (guard === 'authenticated') return true
  if (guard === 'member') return caps.hasMembership || caps.isPlatformAdmin
  if (guard === 'staff') return caps.isStaff || caps.isPlatformAdmin
  if (guard === 'admin') return caps.isAdmin || caps.isPlatformAdmin
  if (guard === 'platform') return caps.isPlatformAdmin
  return true
}

export function ProtectedRoute({ children, guard = 'authenticated' }: ProtectedRouteProps) {
  const { isAuthenticated, sessionLoaded } = useSession()
  const { isLoading, hasMembership, isAdmin, isStaff, isPlatformAdmin } = useMe()
  const location = useLocation()

  const capabilities = { hasMembership, isAdmin, isStaff, isPlatformAdmin }

  if (!sessionLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground" role="status">
          Verificando sesión…
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (guard === 'authenticated') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground" role="status">
          Verificando permisos…
        </div>
      </div>
    )
  }

  // Un usuario autenticado sin membresía institucional activa ni privilegios de
  // plataforma no puede acceder a módulos administrativos.
  if (!hasMembership && !isPlatformAdmin) {
    return <Navigate to="/sin-membresia" replace state={{ from: location.pathname }} />
  }

  if (!evaluateGuard(guard, capabilities)) {
    toast.error('Acceso no autorizado', 'Tu perfil no tiene permiso para esta sección.')
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}