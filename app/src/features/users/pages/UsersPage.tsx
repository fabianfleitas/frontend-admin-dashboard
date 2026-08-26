import { useState } from 'react'
import { RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { SearchBar } from '@/components/common/SearchBar'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { UsersTable } from '../components/UsersTable'
import { useUsers } from '../hooks/useUsers'

const PAGE_SIZE = 20

export function UsersPage() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')

  const usersQuery = useUsers({ limit: PAGE_SIZE, offset })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usuarios autorizados al dashboard. Listado en modo solo lectura (MVP).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre, email, rol o membresía…"
        />
        <Button
          variant="secondary"
          onClick={() => usersQuery.refetch()}
          disabled={usersQuery.isFetching}
          aria-label="Actualizar listado"
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={usersQuery.isFetching ? 'animate-spin' : ''}
          />
          Actualizar
        </Button>
        <p className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={12} aria-hidden />
          Gestión de usuarios (crear/editar) — pendiente backend (Nivel 2).
        </p>
      </div>

      {usersQuery.isError ? (
        <ErrorState
          message="No fue posible cargar los usuarios."
          onRetry={() => usersQuery.refetch()}
        />
      ) : usersQuery.isLoading ? (
        <UsersTable users={[]} loading search={search} />
      ) : !usersQuery.data || usersQuery.data.items.length === 0 ? (
        <UsersTable users={[]} search={search} />
      ) : (
        <>
          <UsersTable users={usersQuery.data.items} search={search} />
          <Pagination
            total={usersQuery.data.pagination.total}
            limit={usersQuery.data.pagination.limit}
            offset={usersQuery.data.pagination.offset}
            onPageChange={setOffset}
          />
        </>
      )}
    </div>
  )
}