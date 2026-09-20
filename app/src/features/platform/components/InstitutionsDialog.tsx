import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import { usePlatformInstitutions } from '../hooks/usePlatformInstitutions'
import { useCreateInstitution } from '../hooks/useCreateInstitution'
import { useUpdateInstitution } from '../hooks/useUpdateInstitution'
import { useDeleteInstitution } from '../hooks/useDeleteInstitution'
import { institutionSchema, type InstitutionFormResolved, type InstitutionFormValues } from '../schemas/institution.schema'
import type { InstitutionIn, InstitutionOut } from '../types'
import { toast } from '@/stores/toast.store'

interface InstitutionsDialogProps {
  open: boolean
  onClose: () => void
}

interface InstitutionFormModalProps {
  open: boolean
  onClose: () => void
  editing: InstitutionOut | null
}

export function InstitutionsDialog({ open, onClose }: InstitutionsDialogProps) {
  const institutionsQuery = usePlatformInstitutions()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<InstitutionOut | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<InstitutionOut | null>(null)
  const deleteInstitution = useDeleteInstitution()

  function handleEdit(institution: InstitutionOut) {
    setEditing(institution)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!confirmDelete) return
    try {
      await deleteInstitution.mutateAsync(confirmDelete.id)
      toast.success('Institución desactivada.')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(
        'No fue posible desactivar la institución.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar instituciones"
      description="Consola de superadmin — CRUD de instituciones."
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Al desactivar una institución (soft-delete), deja de aparecer en el listado; no se
            borran sus miembros ni documentos.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={14} aria-hidden />
            Nueva institución
          </Button>
        </div>

        {institutionsQuery.isError ? (
          <ErrorState
            message="No fue posible cargar las instituciones."
            onRetry={() => institutionsQuery.refetch()}
          />
        ) : institutionsQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !institutionsQuery.data || institutionsQuery.data.length === 0 ? (
          <EmptyState
            icon={<Building2 size={18} />}
            title="No existen instituciones."
            description="Crea la primera institución para el sistema."
          />
        ) : (
          <ul className="divide-y rounded-lg border">
            {institutionsQuery.data.map((institution) => (
              <li key={institution.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {institution.nombre}
                    </p>
                    <StatusBadge
                      label={institution.activo ? 'Activa' : 'Inactiva'}
                      tone={institution.activo ? 'success' : 'neutral'}
                    />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {[institution.codigo, institution.ciudad, institution.pais]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(institution)}
                    aria-label={`Editar institución ${institution.nombre}`}
                  >
                    <Pencil size={14} aria-hidden />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(institution)}
                    disabled={!institution.activo}
                    aria-label={`Desactivar institución ${institution.nombre}`}
                  >
                    <Trash2 size={14} aria-hidden />
                    Desactivar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {formOpen && <InstitutionFormModal open={formOpen} onClose={handleCloseForm} editing={editing} />}

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Desactivar institución"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteInstitution.isPending}>
              {deleteInstitution.isPending ? 'Desactivando…' : 'Desactivar'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
          <p className="text-sm text-muted-foreground">
            La institución{' '}
            <span className="font-medium text-foreground">{confirmDelete?.nombre}</span> se marcará
            como inactiva. No se eliminan sus miembros ni documentos asociados.
          </p>
        </div>
      </Modal>
    </Modal>
  )
}

function toInstitutionIn(values: InstitutionFormResolved): InstitutionIn {
  return {
    codigo: values.codigo?.trim() || null,
    nombre: values.nombre.trim(),
    nombre_comercial: values.nombre_comercial?.trim() || null,
    ciudad: values.ciudad?.trim() || null,
    pais: values.pais?.trim() || null,
    direccion: values.direccion?.trim() || null,
    email_contacto: values.email_contacto?.trim() || null,
    telefono_contacto: values.telefono_contacto?.trim() || null,
  }
}

function InstitutionFormModal({ open, onClose, editing }: InstitutionFormModalProps) {
  const createInstitution = useCreateInstitution()
  const updateInstitution = useUpdateInstitution()
  const pending = createInstitution.isPending || updateInstitution.isPending
  const isEditing = editing !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      codigo: editing?.codigo ?? '',
      nombre: editing?.nombre ?? '',
      nombre_comercial: editing?.nombre_comercial ?? '',
      ciudad: editing?.ciudad ?? '',
      pais: editing?.pais ?? '',
      direccion: editing?.direccion ?? '',
      email_contacto: editing?.email_contacto ?? '',
      telefono_contacto: editing?.telefono_contacto ?? '',
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  async function onSubmit(values: InstitutionFormResolved) {
    const payload = toInstitutionIn(values)
    try {
      if (isEditing && editing) {
        await updateInstitution.mutateAsync({ id: editing.id, payload })
        toast.success('Institución actualizada.')
      } else {
        await createInstitution.mutateAsync(payload)
        toast.success('Institución creada.')
      }
      handleClose()
    } catch (err) {
      toast.error(
        isEditing ? 'No fue posible actualizar la institución.' : 'No fue posible crear la institución.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar institución' : 'Nueva institución'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              void handleSubmit(onSubmit)(e)
            }}
            disabled={pending}
          >
            {pending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear institución'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre *" id="inst-nombre" error={errors.nombre?.message}>
            <input id="inst-nombre" {...register('nombre')} className={inputClass} placeholder="Ej. Universidad Nacional" />
          </Field>
          <Field label="Código" id="inst-codigo" error={errors.codigo?.message}>
            <input id="inst-codigo" {...register('codigo')} className={inputClass} placeholder="Ej. UNI" />
          </Field>
          <Field label="Nombre comercial" id="inst-comercial" error={errors.nombre_comercial?.message}>
            <input id="inst-comercial" {...register('nombre_comercial')} className={inputClass} />
          </Field>
          <Field label="Email contacto" id="inst-email" error={errors.email_contacto?.message}>
            <input id="inst-email" {...register('email_contacto')} className={inputClass} placeholder="contacto@inst.edu" />
          </Field>
          <Field label="Ciudad" id="inst-ciudad" error={errors.ciudad?.message}>
            <input id="inst-ciudad" {...register('ciudad')} className={inputClass} />
          </Field>
          <Field label="País" id="inst-pais" error={errors.pais?.message}>
            <input id="inst-pais" {...register('pais')} className={inputClass} placeholder="Ej. PE" />
          </Field>
          <Field label="Teléfono" id="inst-tel" error={errors.telefono_contacto?.message}>
            <input id="inst-tel" {...register('telefono_contacto')} className={inputClass} />
          </Field>
        </div>
        <Field label="Dirección" id="inst-dir" error={errors.direccion?.message}>
          <textarea id="inst-dir" {...register('direccion')} rows={2} className={inputClass} />
        </Field>
      </form>
    </Modal>
  )
}

const inputClass =
  'h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none'

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}