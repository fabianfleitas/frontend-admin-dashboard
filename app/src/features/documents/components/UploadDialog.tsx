import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, FileText, X } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import {
  uploadDocumentSchema,
  type UploadDocumentResolved,
  type UploadDocumentValues,
} from '../schemas/upload.schema'
import { useUploadDocument } from '../hooks/useUploadDocument'
import { toast } from '@/stores/toast.store'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
}

const MAX_SIZE = 25 * 1024 * 1024 // 25 MB

export function UploadDialog({ open, onClose }: UploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const upload = useUploadDocument()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UploadDocumentValues>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoria_id: null,
      codigo_documento: null,
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const file = e.target.files?.[0]
    if (!file) {
      setFileName(null)
      setValue('file', undefined as unknown as File)
      return
    }
    if (file.type && file.type !== 'application/pdf') {
      setFileError('Solo se permiten archivos PDF.')
      setFileName(null)
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE) {
      setFileError('El archivo supera el tamaño máximo de 25 MB.')
      setFileName(null)
      e.target.value = ''
      return
    }
    setFileName(file.name)
    setValue('file', file, { shouldValidate: true })
  }

  function handleClose() {
    reset()
    setFileName(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  async function onSubmit(values: UploadDocumentResolved) {
    try {
      await upload.mutateAsync({
        file: values.file,
        titulo: values.titulo,
        descripcion: values.descripcion || null,
        categoria_id: values.categoria_id ?? null,
        codigo_documento: values.codigo_documento ?? null,
      })
      toast.success('Documento cargado.', 'La indexación iniciará en breve.')
      handleClose()
    } catch (err) {
      toast.error(
        'No fue posible cargar el documento.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Subir documento"
      description="Solo se aceptan archivos PDF con un tamaño máximo de 25 MB."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={upload.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              void handleSubmit(onSubmit)(e)
            }}
            disabled={upload.isPending || !fileName}
          >
            <Upload size={14} aria-hidden />
            {upload.isPending ? 'Subiendo…' : 'Subir documento'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="upload-file">
            Archivo PDF *
          </label>
          <div
            className="flex cursor-pointer items-center justify-between rounded-md border border-dashed bg-muted/30 px-4 py-3 text-sm transition-colors hover:border-primary"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={16} aria-hidden />
              {fileName ? (
                <span className="font-medium text-foreground">{fileName}</span>
              ) : (
                <span>Seleccionar archivo…</span>
              )}
            </div>
            {fileName && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFileName(null)
                  setValue('file', undefined as unknown as File)
                  if (inputRef.current) inputRef.current.value = ''
                }}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Quitar archivo"
              >
                <X size={14} aria-hidden />
              </button>
            )}
            <input
              ref={inputRef}
              id="upload-file"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {fileError && <p className="text-xs text-danger">{fileError}</p>}
          {errors.file && <p className="text-xs text-danger">{errors.file.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="upload-titulo">
              Título *
            </label>
            <input
              id="upload-titulo"
              {...register('titulo')}
              className="h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Título descriptivo"
            />
            {errors.titulo && (
              <p className="text-xs text-danger">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="upload-codigo"
            >
              Código de documento
            </label>
            <input
              id="upload-codigo"
              {...register('codigo_documento')}
              className="h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Opcional"
            />
            {errors.codigo_documento && (
              <p className="text-xs text-danger">{errors.codigo_documento.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="upload-categoria"
            >
              Categoría (ID)
            </label>
            <input
              id="upload-categoria"
              type="number"
              min={1}
              {...register('categoria_id')}
              className="h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Opcional"
            />
            {errors.categoria_id && (
              <p className="text-xs text-danger">{errors.categoria_id.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Gestión de categorías pendiente en backend (Nivel 2).
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="upload-descripcion"
            >
              Descripción
            </label>
            <textarea
              id="upload-descripcion"
              {...register('descripcion')}
              rows={2}
              className="w-full rounded-md border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Opcional"
            />
            {errors.descripcion && (
              <p className="text-xs text-danger">{errors.descripcion.message}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  )
}