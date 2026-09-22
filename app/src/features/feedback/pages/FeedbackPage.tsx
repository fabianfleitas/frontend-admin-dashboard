import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/forms/Select'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FeedbackTable } from '../components/FeedbackTable'
import { useFeedback } from '../hooks/useFeedback'
import { useDeleteFeedback } from '../hooks/useDeleteFeedback'

const PAGE_SIZE = 20

const RATING_OPTIONS = [
  { value: '', label: 'Todas las valoraciones' },
  { value: '5', label: '5 (excelente)' },
  { value: '4', label: '4 (bueno)' },
  { value: '3', label: '3 (regular)' },
  { value: '2', label: '2 (malo)' },
  { value: '1', label: '1 (pésimo)' },
]

export function FeedbackPage() {
  const [rating, setRating] = useState('')
  const [offset, setOffset] = useState(0)

  const query = useFeedback({
    rating: rating === '' ? null : Number(rating),
    limit: PAGE_SIZE,
    offset,
  })

  const deleteMutation = useDeleteFeedback()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Valoraciones de los usuarios sobre las respuestas del asistente.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={rating}
          onChange={(value) => {
            setRating(value)
            setOffset(0)
          }}
          options={RATING_OPTIONS}
          aria-label="Filtrar por valoración"
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
            {rating ? `Filtrando por valoración ${rating}` : 'Todos los feedback'}
          </span>
        )}
      </div>

      {query.isError ? (
        <ErrorState
          message="No fue posible cargar el feedback."
          onRetry={() => query.refetch()}
        />
      ) : query.isLoading ? (
        <FeedbackTable items={[]} loading />
      ) : !query.data || query.data.items.length === 0 ? (
        <FeedbackTable items={[]} />
      ) : (
        <>
          <FeedbackTable
            items={query.data.items}
            onDelete={(id) => deleteMutation.mutate(id)}
            deletingId={deleteMutation.isPending ? (deleteMutation.variables ?? null) : null}
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