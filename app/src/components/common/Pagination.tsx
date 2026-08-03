import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export function Pagination({ total, limit, offset, onPageChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const hasNext = offset + limit < total
  const hasPrev = offset > 0

  return (
    <div className="flex items-center justify-between gap-4 px-1 text-sm">
      <span className="text-muted-foreground">
        Mostrando {total === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} de {total}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={!hasPrev}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} aria-hidden />
          Anterior
        </Button>
        <span className="text-muted-foreground" aria-current="page">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(offset + limit)}
          disabled={!hasNext}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight size={14} aria-hidden />
        </Button>
      </div>
    </div>
  )
}