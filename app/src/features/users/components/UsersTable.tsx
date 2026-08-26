import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Users } from 'lucide-react'
import type { UserOut } from '../types'
import { RoleBadge } from './RoleBadge'
import { MemberBadge } from './MemberBadge'

interface UsersTableProps {
  users: UserOut[]
  loading?: boolean
  search?: string
}

function matchSearch(user: UserOut, q: string): boolean {
  return (
    user.external_auth_id.toLowerCase().includes(q) ||
    (user.email ?? '').toLowerCase().includes(q) ||
    (user.full_name ?? '').toLowerCase().includes(q) ||
    user.role.toLowerCase().includes(q) ||
    (user.tipo_miembro ?? '').toLowerCase().includes(q)
  )
}

export function UsersTable({ users, loading = false, search = '' }: UsersTableProps) {
  const q = search.trim().toLowerCase()
  const filtered = q ? users.filter((u) => matchSearch(u, q)) : users

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border bg-surface">
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<Users size={18} />}
        title="No existen usuarios."
        description="No se han registrado usuarios autorizados en el sistema."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Usuario</th>
            <th className="px-4 py-3 font-medium">Membresía</th>
            <th className="px-4 py-3 font-medium">Institución</th>
            <th className="px-4 py-3 font-medium">Rol legacy</th>
            <th className="px-4 py-3 font-medium">Auth ID</th>
            <th className="px-4 py-3 font-medium">Fecha creación</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map((user) => (
            <tr
              key={user.external_auth_id}
              className={cn('transition-colors hover:bg-muted/40')}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">
                  {user.full_name ?? user.email ?? '—'}
                </div>
                {user.email && user.full_name && (
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                )}
                {user.is_platform_admin && (
                  <div className="mt-0.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    Platform admin
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <MemberBadge type={user.tipo_miembro} />
              </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {user.nombre_institucion ?? (user.institucion_id ? `#${user.institucion_id}` : '—')}
                </td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td
                className="px-4 py-3 font-mono text-xs text-muted-foreground"
                title={user.external_auth_id}
              >
                {user.external_auth_id.slice(0, 12)}…
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(user.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}