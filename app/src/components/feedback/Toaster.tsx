import { CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { useToastStore, type ToastTone } from '@/stores/toast.store'
import { cn } from '@/lib/utils'

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'border-success/40 bg-success/10 text-success',
  error: 'border-danger/40 bg-danger/10 text-danger',
  info: 'border-primary/40 bg-primary/10 text-primary',
}

const ICONS: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface px-4 py-3 shadow-md',
              TONE_CLASSES[t.tone],
            )}
            role="status"
          >
            <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{t.message}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar notificación"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        )
      })}
    </div>
  )
}