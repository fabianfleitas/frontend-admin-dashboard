import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/forms/Select'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EscalamientosTable } from '../components/EscalamientosTable'
import { useEscalamientos } from '../hooks/useEscalamientos'
import { useResolveEscalamiento } from '../hooks/useResolveEscalamiento'

const PAGE_SIZE = 20

const ESTADO_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'RESOLVED', label: 'Resuelto' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function EscalamientosPage() {
  const [estado, setEstado] = useState('')
  const [offset, setOffset] = useState(0)

  const query = useEscalamientos({
    estado: estado === '' ? null : estado,
    limit: PAGE_SIZE,
    offset,
  })

  const resolveMutation = useResolveEscalamiento()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Escalamientos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultas derivadas a Secretaría para atención especializada.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={estado}
          onChange={(value) => {
            setEstado(value)
            setOffset(0)
          }}
          options={ESTADO_OPTIONS}
          aria-label="Filtrar por estado"
        />
        <Button
          variant="secondary"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          aria-label="Actualizar listado"
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={query.isFetching ? 'animate-spin' : ''}
          />
          Actualizar
        </Button>
        {query.data && query.data.pagination.total > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {estado ? `Filtrando por ${estado}` : 'Todos los escalamientos'}
          </span>
        )}
      </div>

      {query.isError ? (
        <ErrorState
          message="No fue posible cargar los escalamientos."
          onRetry={() => query.refetch()}
        />
      ) : query.isLoading ? (
        <EscalamientosTable items={[]} loading />
      ) : !query.data || query.data.items.length === 0 ? (
        <EscalamientosTable items={[]} />
      ) : (
        <>
          <EscalamientosTable
            items={query.data.items}
            onResolve={(id) => resolveMutation.mutate(id)}
            resolvingId={
              resolveMutation.isPending ? (resolveMutation.variables ?? null) : null
            }
          />
          <Pagination
            total={query.data.pagination.total}
            limit={query.data.pagination.limit}
            offset={query.data.pagination.offset}
            onPageChange={setOffset}
          />
        </>
      )}
    </div>
  )
}