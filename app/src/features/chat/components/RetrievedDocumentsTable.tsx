import { EmptyState } from '@/components/feedback/EmptyState'
import { FileText } from 'lucide-react'
import type { SourceOut } from '../types'

interface RetrievedDocumentsTableProps {
  sources: SourceOut[]
}

export function RetrievedDocumentsTable({ sources }: RetrievedDocumentsTableProps) {
  if (sources.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={16} />}
        title="No se recuperaron documentos."
        description="El RAG no utilizó contexto para esta respuesta."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Documento</th>
            <th className="px-3 py-2 font-medium">Página</th>
            <th className="px-3 py-2 font-medium">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sources.map((source, idx) => (
            <tr key={`${source.document_id}-${source.page}-${idx}`}>
              <td className="px-3 py-2 font-medium text-foreground">{source.document}</td>
              <td className="px-3 py-2 text-muted-foreground">{source.page}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {(source.similarity_score * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}