import { useState } from 'react'
import { EyeOff, AlertTriangle } from 'lucide-react'
import { Drawer } from '@/components/common/Drawer'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SectionTitle } from '@/components/common/SectionTitle'
import { MetricsCard } from '@/features/chat/components/MetricsCard'
import { useConversation } from '../hooks/useConversation'
import { useHideConversation } from '../hooks/useHideConversation'
import { MessageTimeline } from './MessageTimeline'
import { formatDate } from '@/lib/utils'
import { toast } from '@/stores/toast.store'
import { isNotFound } from '@/lib/http'
import { isAssistantMessage } from '@/features/chat/types'

interface ConversationDrawerProps {
  conversationId: number | null
  onClose: () => void
}

export function ConversationDrawer({ conversationId, onClose }: ConversationDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useConversation(conversationId)
  const isError404 = isError && isNotFound(error)
  const hide = useHideConversation()
  const [confirmHide, setConfirmHide] = useState(false)

  const messages = data?.messages ?? []
  const lastAssistant =
    [...messages].reverse().find((m) => isAssistantMessage(m)) ?? null

  async function handleHide() {
    if (!conversationId) return
    try {
      await hide.mutateAsync(conversationId)
      toast.success('Conversación oculta.')
      setConfirmHide(false)
      onClose()
    } catch (err) {
      toast.error(
        'No fue posible ocultar la conversación.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Drawer
      open={conversationId !== null}
      onClose={onClose}
      title={data?.title ?? 'Detalle de conversación'}
      description={`ID: ${conversationId ?? '—'}`}
      size="lg"
      footer={
        data ? (
          <Button variant="danger" onClick={() => setConfirmHide(true)} disabled={hide.isPending}>
            <EyeOff size={14} aria-hidden />
            Ocultar conversación
          </Button>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : isError ? (
        <ErrorState
          message={
            isError404
              ? 'No se encontró la conversación o pertenece a otra institución. El aislamiento es por institución.'
              : 'No fue posible cargar la conversación.'
          }
          onRetry={() => refetch()}
        />
      ) : !data ? (
        <p className="text-sm text-muted-foreground">No se encontró la conversación.</p>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3">
            <SectionTitle title="Información general" />
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Título</dt>
              <dd className="font-medium text-foreground">{data.title}</dd>
              <dt className="text-muted-foreground">Mensajes</dt>
              <dd className="font-medium text-foreground">{data.messages.length}</dd>
              <dt className="text-muted-foreground">Última interacción</dt>
              <dd className="font-medium text-foreground">
                {formatDate(lastAssistant?.fecha_envio ?? null)}
              </dd>
              <dt className="text-muted-foreground">Usuario (auth id)</dt>
              <dd className="truncate font-medium text-muted-foreground">
                {lastAssistant?.conversacion_id ? 'Disponible vía Audit' : '—'}
              </dd>
            </dl>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Conversación" />
            <div className="max-h-96 overflow-y-auto rounded-md border bg-background/40 p-3">
              <MessageTimeline messages={data.messages} />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Información técnica" />
            <MetricsCard message={lastAssistant} />
          </section>

          <Modal
            open={confirmHide}
            onClose={() => setConfirmHide(false)}
            title="Ocultar conversación"
            size="sm"
            footer={
              <>
                <Button variant="secondary" onClick={() => setConfirmHide(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleHide} disabled={hide.isPending}>
                  {hide.isPending ? 'Ocultando…' : 'Ocultar'}
                </Button>
              </>
            }
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
              <p className="text-sm text-muted-foreground">
                La conversación se marcará como oculta y dejará de aparecer en el listado por
                defecto. Podrás verla activando el filtro &quot;incluir ocultas&quot;.
              </p>
            </div>
          </Modal>
        </div>
      )}
    </Drawer>
  )
}