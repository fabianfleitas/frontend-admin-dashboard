import { ContextPanel as ChatContextPanel } from '@/features/chat/components/ContextPanel'
import { EmptyState } from '@/components/feedback/EmptyState'
import { FileText } from 'lucide-react'
import type { SourceOut } from '@/features/chat/types'
import type { MessageOut } from '@/features/chat/types'

interface ContextViewerProps {
  sources: SourceOut[]
  lastAssistantMessage: MessageOut | null
}

export function ContextViewer({ sources, lastAssistantMessage }: ContextViewerProps) {
  if (sources.length === 0 && !lastAssistantMessage) {
    return (
      <EmptyState
        icon={<FileText size={16} />}
        title="Sin contexto registrado."
        description="El backend no retorna fuentes recuperadas para esta conversación en el listado."
      />
    )
  }
  return <ChatContextPanel sources={sources} lastAssistantMessage={lastAssistantMessage} />
}