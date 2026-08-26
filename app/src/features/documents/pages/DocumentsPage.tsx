import { useState } from 'react'
import { Upload, RefreshCw, BookOpen } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { SearchBar } from '@/components/common/SearchBar'
import { Pagination } from '@/components/common/Pagination'
import { Select } from '@/components/forms/Select'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { useDocuments } from '../hooks/useDocuments'
import { useCategoriesLookup } from '../hooks/useCategories'
import { DocumentsTable } from '../components/DocumentsTable'
import { DocumentDrawer } from '../components/DocumentDrawer'
import { UploadDialog } from '../components/UploadDialog'
import type { DocumentStatus } from '../types'

const PAGE_SIZE = 20

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'READY', label: 'Ready' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'INACTIVE', label: 'Inactive' },
]

type StatusFilter = DocumentStatus | 'INACTIVE' | 'ALL'

export function DocumentsPage() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const documentsQuery = useDocuments({ limit: PAGE_SIZE, offset })
  const { active, byId } = useCategoriesLookup()

  const categoryOptions = [
    { value: 'ALL', label: 'Todas las categorías' },
    ...active.map((c) => ({ value: String(c.id), label: c.nombre })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión documental, versiones y reindexación del sistema RAG.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload size={16} aria-hidden />
          Subir documento
        </Button>
      </div>

      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar documentos…" />
        <Select
          value={status}
          onChange={(v) => setStatus(v as StatusFilter)}
          options={STATUS_OPTIONS}
        />
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          placeholder="Todas las categorías"
          aria-label="Filtrar por categoría"
        />
        <Button
          variant="secondary"
          onClick={() => documentsQuery.refetch()}
          disabled={documentsQuery.isFetching}
          aria-label="Actualizar listado"
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={documentsQuery.isFetching ? 'animate-spin' : ''}
          />
          Actualizar
        </Button>
      </div>

      {/* Contenido */}
      {documentsQuery.isError ? (
        <ErrorState
          message="No fue posible cargar los documentos."
          onRetry={() => documentsQuery.refetch()}
        />
      ) : documentsQuery.isLoading ? (
        <DocumentsTable
          documents={[]}
          loading
          onSelect={() => undefined}
          filters={{ search, status, category: categoryFilter }}
        />
      ) : !documentsQuery.data || documentsQuery.data.items.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={18} />}
          title="No existen documentos."
          description="Carga tu primer documento para iniciar la base de conocimiento."
          action={
            <Button onClick={() => setUploadOpen(true)}>
              <Upload size={14} aria-hidden />
              Subir documento
            </Button>
          }
        />
      ) : (
        <>
          <DocumentsTable
            documents={documentsQuery.data.items}
            onSelect={setSelectedId}
            selectedId={selectedId}
            filters={{ search, status, category: categoryFilter }}
            categoryNames={byId}
          />
          <Pagination
            total={documentsQuery.data.pagination.total}
            limit={documentsQuery.data.pagination.limit}
            offset={documentsQuery.data.pagination.offset}
            onPageChange={setOffset}
          />
        </>
      )}

      <DocumentDrawer documentoId={selectedId} onClose={() => setSelectedId(null)} />
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  )
}