import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  MessagesSquare,
  BarChart3,
  ShieldCheck,
  ThumbsUp,
  Inbox,
  Users,
  Settings,
  Building2,
  CreditCard,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/ui.store'
import { useAuthCapabilities } from '@/features/auth/hooks/useAuthCapabilities'
import { BrandLogo } from '@/components/common/BrandLogo'
import type { RouteGuard } from '@/components/common/ProtectedRoute'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  guard?: RouteGuard
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard, guard: 'member' },
  { to: '/documents', label: 'Base de conocimiento', icon: BookOpen, guard: 'staff' },
  { to: '/playground', label: 'Agente de IA', icon: Bot, guard: 'staff' },
  { to: '/conversations', label: 'Conversaciones', icon: MessagesSquare, guard: 'staff' },
  { to: '/analytics', label: 'Analítica', icon: BarChart3, guard: 'staff' },
  { to: '/audit', label: 'Auditoría', icon: ShieldCheck, guard: 'staff' },
  { to: '/feedback', label: 'Retroalimentación', icon: ThumbsUp, guard: 'admin' },
  { to: '/escalamientos', label: 'Derivaciones', icon: Inbox, guard: 'staff' },
  { to: '/users', label: 'Usuarios', icon: Users, guard: 'admin' },
  { to: '/settings', label: 'Configuración', icon: Settings, guard: 'admin' },
  { to: '/institution', label: 'Institución', icon: Building2, guard: 'admin' },
  { to: '/billing', label: 'Facturación', icon: CreditCard, guard: 'admin' },
  { to: '/platform', label: 'Plataforma', icon: Globe, guard: 'platform' },
]

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const caps = useAuthCapabilities()

  const can = (guard: RouteGuard | undefined): boolean => {
    if (!guard) return true
    if (guard === 'member') return caps.hasMembership || caps.isPlatformAdmin
    if (guard === 'staff') return caps.isStaff || caps.isPlatformAdmin
    if (guard === 'admin') return caps.isAdmin || caps.isPlatformAdmin
    if (guard === 'platform') return caps.isPlatformAdmin
    return true
  }

  const visibleItems = NAV_ITEMS.filter((item) => can(item.guard))

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-surface transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
      aria-label="Navegación principal"
    >
      <div
        className={cn(
          'flex h-14 items-center justify-between border-b',
          collapsed ? 'px-1.5' : 'px-3',
        )}
      >
        {collapsed ? (
          <BrandLogo icon className="h-6" />
        ) : (
          <BrandLogo className="h-7" sloganClassName="text-[9px] leading-none" />
        )}
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? 'Expandir navegación lateral' : 'Colapsar navegación lateral'}
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} aria-hidden />
          ) : (
            <PanelLeftClose size={18} aria-hidden />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2',
                )
              }
            >
              <Icon size={18} className="shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}