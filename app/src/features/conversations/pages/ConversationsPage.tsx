import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RefreshCw, Eye } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { SearchBar } from '@/components/common/SearchBar'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ConversationsTable } from '../components/ConversationsTable'
import { ConversationDrawer } from '../components/ConversationDrawer'
import { useConversations } from '../hooks/useConversations'

const PAGE_SIZE = 20

export function ConversationsPage() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [includeHidden, setIncludeHidden] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const conversationsQuery = useConversations({
    limit: PAGE_SIZE,
    offset,
    includeHidden,
  })

  // Deep-linking: /conversations/:id abre el drawer de la conversación.
  useEffect(() => {
    if (id === undefined) {
      setSelectedId(null)
      return
    }
    const num = Number(id)
    if (Number.isNaN(num)) {
      navigate('/conversations', { replace: true })
      return
    }
    setSelectedId(num)
  }, [id, navigate])

  function handleSelect(conversationId: number) {
    setSelectedId(conversationId)
    navigate(`/conversations/${conversationId}`)
  }

  function handleCloseDrawer() {
    setSelectedId(null)
    navigate('/conversations')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Conversations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inspección de conversaciones generadas por los usuarios del asistente.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título o ID…"
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) => {
              setIncludeHidden(e.target.checked)
              setOffset(0)
            }}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Incluir ocultas
        </label>
        <Button
          variant="secondary"
          onClick={() => conversationsQuery.refetch()}
          disabled={conversationsQuery.isFetching}
          aria-label="Actualizar listado"
        >
          <RefreshCw
            size={14}
            aria-hidden
            className={conversationsQuery.isFetching ? 'animate-spin' : ''}
          />
          Actualizar
        </Button>
        <p className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Eye size={12} aria-hidden />
          Drawer con mensajes ordenados cronológicamente y trazabilidad completa.
        </p>
      </div>

      {conversationsQuery.isError ? (
        <ErrorState
          message="No fue posible cargar las conversaciones."
          onRetry={() => conversationsQuery.refetch()}
        />
      ) : conversationsQuery.isLoading ? (
        <ConversationsTable
          conversations={[]}
          loading
          onSelect={() => undefined}
          search={search}
        />
      ) : !conversationsQuery.data || conversationsQuery.data.items.length === 0 ? (
        <ConversationsTable
          conversations={[]}
          onSelect={() => undefined}
          search={search}
        />
      ) : (
        <>
          <ConversationsTable
            conversations={conversationsQuery.data.items}
            onSelect={handleSelect}
            selectedId={selectedId}
            search={search}
          />
          <Pagination
            total={conversationsQuery.data.pagination.total}
            limit={conversationsQuery.data.pagination.limit}
            offset={conversationsQuery.data.pagination.offset}
            onPageChange={setOffset}
          />
        </>
      )}

      <ConversationDrawer conversationId={selectedId} onClose={handleCloseDrawer} />
    </div>
  )
}