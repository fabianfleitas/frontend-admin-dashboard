import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { RetrievedDocumentsTable } from './RetrievedDocumentsTable'
import type { SourceOut, MessageOut } from '../types'

interface ContextPanelProps {
  sources: SourceOut[]
  lastAssistantMessage: MessageOut | null
}

export function ContextPanel({ sources, lastAssistantMessage }: ContextPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-lg border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-foreground"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Contexto recuperado
        </span>
        <span className="text-xs text-muted-foreground">{sources.length} fuentes</span>
      </button>
      {open && (
        <div className="space-y-3 border-t px-4 py-3">
          <RetrievedDocumentsTable sources={sources} />
          <div className="space-y-1 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Prompt</p>
            <p>
              El prompt completo no es retornado por el backend actualmente. Marcado como
              pendiente (Nivel 2). Auditoría: {lastAssistantMessage?.audit_id ?? '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}