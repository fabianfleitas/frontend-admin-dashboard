import { type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  retryLabel?: string
  icon?: ReactNode
}

export function ErrorState({
  message = 'No fue posible obtener la información.',
  onRetry,
  retryLabel = 'Actualizar',
  icon,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-danger/40 bg-danger/5 px-6 py-12 text-center"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger">
        {icon ?? <AlertTriangle size={20} aria-hidden />}
      </div>
      <p className="text-sm font-medium text-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <RefreshCw size={14} aria-hidden />
          {retryLabel}
        </button>
      )}
    </div>
  )
}