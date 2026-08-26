import { Coins } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/feedback/Skeleton'
import type { TokensByModel } from '../types'

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es').format(value)
}

export function TokenTable({
  tokensByModel,
  loading = false,
}: {
  tokensByModel: TokensByModel
  loading?: boolean
}) {
  const entries = Object.entries(tokensByModel ?? {})

  return (
    <Card className="flex min-h-[96px] flex-col justify-between gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tokens por modelo
        </p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Coins size={18} aria-hidden />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-6 w-full" />
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin datos de tokens por modelo.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {entries.map(([model, breakdown]) => {
            const total = Object.values(breakdown ?? {}).reduce((a, b) => a + (Number(b) || 0), 0)
            return (
              <li key={model} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-muted-foreground" title={model}>
                  {model}
                </span>
                <span className="font-medium tabular-nums">{formatNumber(total)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}