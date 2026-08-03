import { useState } from 'react'
import { RefreshCw, Info } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { SearchBar } from '@/components/common/SearchBar'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { AuditTable } from '../components/AuditTable'
import { AuditDrawer } from '../components/AuditDrawer'
import { useAudit } from '../hooks/useAudit'
import type { AuditLogOut } from '../types'

const PAGE_SIZE = 20

export function AuditPage() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLogOut | null>(null)

  const auditQuery = useAudit({ limit: PAGE_SIZE, offset })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Audit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trazabilidad completa de las evaluaciones del sistema RAG.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por ID, mensaje u observación…"
        />
        <Button
          variant="secondary"
          onClick={() => auditQuery.refetch()}
          disabled={auditQuery.isFetching}
          aria-label="Actualizar listado"
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={auditQuery.isFetching ? 'animate-spin' : ''}
          />
          Actualizar
        </Button>
        <p className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info size={12} aria-hidden />
          <code>AuditLogOut</code> no incluye prompt/respuesta/usuario — enlazar a Conversations
          vía <code>mensaje_id</code>.
        </p>
      </div>

      {auditQuery.isError ? (
        <ErrorState
          message="No fue posible cargar los registros de auditoría."
          onRetry={() => auditQuery.refetch()}
        />
      ) : auditQuery.isLoading ? (
        <AuditTable
          logs={[]}
          loading
          onSelect={() => undefined}
          search={search}
        />
      ) : !auditQuery.data || auditQuery.data.items.length === 0 ? (
        <AuditTable logs={[]} onSelect={() => undefined} search={search} />
      ) : (
        <>
          <AuditTable
            logs={auditQuery.data.items}
            onSelect={setSelectedLog}
            selectedId={selectedLog?.id ?? null}
            search={search}
          />
          <Pagination
            total={auditQuery.data.pagination.total}
            limit={auditQuery.data.pagination.limit}
            offset={auditQuery.data.pagination.offset}
            onPageChange={setOffset}
          />
        </>
      )}

      <AuditDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  )
}