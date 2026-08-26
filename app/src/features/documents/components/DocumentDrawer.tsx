import { useRef, useState } from 'react'
import { RefreshCw, Trash2, Upload, AlertTriangle } from 'lucide-react'
import { Drawer } from '@/components/common/Drawer'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SectionTitle } from '@/components/common/SectionTitle'
import { useDocument } from '../hooks/useDocument'
import { useUploadVersion } from '../hooks/useUploadVersion'
import { useReindex } from '../hooks/useReindex'
import { useDeactivateDocument } from '../hooks/useDeactivateDocument'
import { VersionTimeline } from './VersionTimeline'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { formatDate } from '@/lib/utils'
import { toast } from '@/stores/toast.store'
import { isNotFound } from '@/lib/http'

interface DocumentDrawerProps {
  documentoId: number | null
  onClose: () => void
}

export function DocumentDrawer({ documentoId, onClose }: DocumentDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useDocument(documentoId)
  const isError404 = isError && isNotFound(error)
  const uploadVersion = useUploadVersion()
  const reindex = useReindex()
  const deactivate = useDeactivateDocument()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)

  async function handleVersionFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !documentoId) return
    if (file.size > 25 * 1024 * 1024) {
      toast.error('El archivo supera el tamaño máximo de 25 MB.')
      return
    }
    try {
      await uploadVersion.mutateAsync({ documentoId, file })
      toast.success('Nueva versión cargada.', 'La indexación iniciará en breve.')
    } catch (err) {
      toast.error(
        'No fue posible subir la versión.',
        err instanceof Error ? err.message : undefined,
      )
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleReindex() {
    if (!documentoId) return
    try {
      const res = await reindex.mutateAsync(documentoId)
      toast.success(
        'Reindexación iniciada.',
        `${res.updated_versions} versiones actualizadas.`,
      )
    } catch (err) {
      toast.error(
        'No fue posible iniciar la reindexación.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  async function handleDeactivate() {
    if (!documentoId) return
    try {
      await deactivate.mutateAsync(documentoId)
      toast.success('Documento desactivado.')
      setConfirmDeactivate(false)
      onClose()
    } catch (err) {
      toast.error(
        'No fue posible desactivar el documento.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Drawer
      open={documentoId !== null}
      onClose={onClose}
      title={data?.titulo ?? 'Detalle del documento'}
      description={data?.codigo_documento ?? undefined}
      size="lg"
      footer={
        data ? (
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmDeactivate(true)}
              disabled={deactivate.isPending || !data.activo}
            >
              <Trash2 size={14} aria-hidden />
              Desactivar
            </Button>
            <Button variant="secondary" onClick={handleReindex} disabled={reindex.isPending}>
              <RefreshCw size={14} aria-hidden />
              {reindex.isPending ? 'Reindexando…' : 'Reindexar'}
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadVersion.isPending}>
              <Upload size={14} aria-hidden />
              {uploadVersion.isPending ? 'Subiendo…' : 'Nueva versión'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleVersionFile}
            />
          </>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
        <ErrorState
          message={
            isError404
              ? 'No se encontró el documento o pertenece a otra institución. El aislamiento es por institución.'
              : 'No fue posible cargar el documento.'
          }
          onRetry={() => refetch()}
        />
      ) : !data ? (
        <p className="text-sm text-muted-foreground">No se encontró el documento.</p>
      ) : (
        <div className="space-y-6">
          <section className="space-y-2">
            <SectionTitle title="Información general" />
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Categoría ID</dt>
              <dd className="font-medium text-foreground">{data.categoria_id ?? '—'}</dd>
              <dt className="text-muted-foreground">Código</dt>
              <dd className="font-medium text-foreground">{data.codigo_documento ?? '—'}</dd>
              <dt className="text-muted-foreground">Fecha creación</dt>
              <dd className="font-medium text-foreground">{formatDate(data.fecha_creacion)}</dd>
              <dt className="text-muted-foreground">Estado</dt>
              <dd>
                <DocumentStatusBadge
                  status={data.versiones.find((v) => v.es_version_activa)?.status ?? null}
                  activo={data.activo}
                />
              </dd>
            </dl>
            {data.descripcion && (
              <div className="space-y-1 pt-2">
                <p className="text-sm font-medium text-foreground">Descripción</p>
                <p className="text-sm text-muted-foreground">{data.descripcion}</p>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <SectionTitle title="Versiones" description={`${data.versiones.length} versiones registradas`} />
            <VersionTimeline versions={data.versiones} />
          </section>

          <section className="space-y-2">
            <SectionTitle title="Auditoría" />
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Última versión activa</dt>
              <dd className="font-medium text-foreground">
                {data.versiones.find((v) => v.es_version_activa)?.numero_version ?? '—'}
              </dd>
              <dt className="text-muted-foreground">Última carga por</dt>
              <dd className="truncate font-medium text-foreground">
                {data.versiones[0]?.cargado_por_external_auth_id ?? '—'}
              </dd>
              <dt className="text-muted-foreground">Última indexación</dt>
              <dd className="font-medium text-foreground">
                {formatDate(data.versiones[0]?.indexed_at ?? null)}
              </dd>
            </dl>
          </section>
        </div>
      )}

      <Modal
        open={confirmDeactivate}
        onClose={() => setConfirmDeactivate(false)}
        title="Desactivar documento"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDeactivate(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeactivate} disabled={deactivate.isPending}>
              {deactivate.isPending ? 'Desactivando…' : 'Desactivar'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
          <p className="text-sm text-muted-foreground">
            El documento se marcará como inactivo y dejará de estar disponible para consultas RAG.
            Esta acción no elimina ni borra los archivos cargados.
          </p>
        </div>
      </Modal>
    </Drawer>
  )
}