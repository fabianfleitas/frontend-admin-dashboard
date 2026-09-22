import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  MessagesSquare,
  BarChart3,
  ShieldCheck,
  ThumbsUp,
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
import type { RouteGuard } from '@/components/common/ProtectedRoute'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  guard?: RouteGuard
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, guard: 'member' },
  { to: '/documents', label: 'Knowledge Base', icon: BookOpen, guard: 'staff' },
  { to: '/playground', label: 'AI Agent', icon: Bot, guard: 'member' },
  { to: '/conversations', label: 'Conversations', icon: MessagesSquare, guard: 'member' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, guard: 'staff' },
  { to: '/audit', label: 'Audit', icon: ShieldCheck, guard: 'staff' },
  { to: '/feedback', label: 'Feedback', icon: ThumbsUp, guard: 'staff' },
  { to: '/users', label: 'Users', icon: Users, guard: 'admin' },
  { to: '/settings', label: 'Settings', icon: Settings, guard: 'admin' },
  { to: '/institution', label: 'Institución', icon: Building2, guard: 'admin' },
  { to: '/billing', label: 'Billing', icon: CreditCard, guard: 'admin' },
  { to: '/platform', label: 'Platform', icon: Globe, guard: 'platform' },
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
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Admin Dashboard
          </span>
        )}
        <button
          type="button"
          onClick={toggle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
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