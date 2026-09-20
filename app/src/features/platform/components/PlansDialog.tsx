import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Landmark, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import { usePlatformPlans } from '../hooks/usePlatformPlans'
import { useCreatePlan } from '../hooks/useCreatePlan'
import { useUpdatePlan } from '../hooks/useUpdatePlan'
import { useDeletePlan } from '../hooks/useDeletePlan'
import { planSchema, toPlanIn, type PlanFormResolved, type PlanFormValues } from '../schemas/plan.schema'
import type { PlanIn } from '../types'
import type { PlanOut } from '@/features/billing/types'
import { toast } from '@/stores/toast.store'

interface PlansDialogProps {
  open: boolean
  onClose: () => void
}

interface PlanFormModalProps {
  open: boolean
  onClose: () => void
  editing: PlanOut | null
}

export function PlansDialog({ open, onClose }: PlansDialogProps) {
  const plansQuery = usePlatformPlans()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<PlanOut | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<PlanOut | null>(null)
  const deletePlan = useDeletePlan()

  function handleEdit(plan: PlanOut) {
    setEditing(plan)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!confirmDelete) return
    try {
      await deletePlan.mutateAsync(confirmDelete.id)
      toast.success('Plan desactivado.')
      setConfirmDelete(null)
    } catch (err) {
      toast.error('No fue posible desactivar el plan.', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar planes"
      description="Consola de superadmin — CRUD de planes."
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
            Los planes nuevos no tienen precio de Stripe hasta sincronizarlos con
            &quot;sync-plan&quot; desde Billing.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={14} aria-hidden />
            Nuevo plan
          </Button>
        </div>

        {plansQuery.isError ? (
          <ErrorState message="No fue posible cargar los planes." onRetry={() => plansQuery.refetch()} />
        ) : plansQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !plansQuery.data || plansQuery.data.length === 0 ? (
          <EmptyState icon={<Landmark size={18} />} title="No existen planes." description="Crea el primer plan del sistema." />
        ) : (
          <ul className="divide-y rounded-lg border">
            {plansQuery.data.map((plan) => (
              <li key={plan.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{plan.nombre}</p>
                    <StatusBadge label={plan.activo ? 'Activo' : 'Inactivo'} tone={plan.activo ? 'success' : 'neutral'} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {plan.precio} {plan.moneda ?? ''} {plan.intervalo ? `/ ${plan.intervalo}` : ''} · Máx. docs:{' '}
                    {plan.max_documentos ?? '—'} · usuarios: {plan.max_usuarios ?? '—'}
                    {plan.stripe_price_id ? '' : ' · sin precio Stripe'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)} aria-label={`Editar plan ${plan.nombre}`}>
                    <Pencil size={14} aria-hidden />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(plan)}
                    disabled={!plan.activo}
                    aria-label={`Desactivar plan ${plan.nombre}`}
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

      {formOpen && <PlanFormModal open={formOpen} onClose={handleCloseForm} editing={editing} />}

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Desactivar plan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deletePlan.isPending}>
              {deletePlan.isPending ? 'Desactivando…' : 'Desactivar'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
          <p className="text-sm text-muted-foreground">
            El plan <span className="font-medium text-foreground">{confirmDelete?.nombre}</span> se marcará como
            inactivo. No se eliminan las suscripciones que lo referencian.
          </p>
        </div>
      </Modal>
    </Modal>
  )
}

function PlanFormModal({ open, onClose, editing }: PlanFormModalProps) {
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()
  const pending = createPlan.isPending || updatePlan.isPending
  const isEditing = editing !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      codigo: editing?.codigo ?? '',
      nombre: editing?.nombre ?? '',
      descripcion: editing?.descripcion ?? '',
      precio: editing?.precio != null ? String(editing.precio) : '',
      moneda: editing?.moneda ?? '',
      intervalo: editing?.intervalo ?? '',
      max_documentos: editing?.max_documentos != null ? String(editing.max_documentos) : '',
      max_usuarios: editing?.max_usuarios != null ? String(editing.max_usuarios) : '',
      max_estudiantes: editing?.max_estudiantes != null ? String(editing.max_estudiantes) : '',
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  async function onSubmit(values: PlanFormResolved) {
    const payload: PlanIn = toPlanIn(values)
    try {
      if (isEditing && editing) {
        await updatePlan.mutateAsync({ id: editing.id, payload })
        toast.success('Plan actualizado.')
      } else {
        await createPlan.mutateAsync(payload)
        toast.success('Plan creado.')
      }
      handleClose()
    } catch (err) {
      toast.error(
        isEditing ? 'No fue posible actualizar el plan.' : 'No fue posible crear el plan.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar plan' : 'Nuevo plan'}
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
            {pending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear plan'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre *" id="plan-nombre" error={errors.nombre?.message}>
            <input id="plan-nombre" {...register('nombre')} className={inputClass} placeholder="Ej. Base" />
          </Field>
          <Field label="Código" id="plan-codigo" error={errors.codigo?.message}>
            <input id="plan-codigo" {...register('codigo')} className={inputClass} placeholder="Ej. BAS" />
          </Field>
          <Field label="Precio" id="plan-precio" error={errors.precio?.message}>
            <input id="plan-precio" type="number" min={0} step="0.01" {...register('precio')} className={inputClass} />
          </Field>
          <Field label="Moneda" id="plan-moneda" error={errors.moneda?.message}>
            <input id="plan-moneda" {...register('moneda')} className={inputClass} placeholder="Ej. USD" />
          </Field>
          <Field label="Intervalo" id="plan-intervalo" error={errors.intervalo?.message}>
            <input id="plan-intervalo" {...register('intervalo')} className={inputClass} placeholder="month / year" />
          </Field>
          <Field label="Máx. documentos" id="plan-docs" error={errors.max_documentos?.message}>
            <input id="plan-docs" type="number" min={0} step={1} {...register('max_documentos')} className={inputClass} />
          </Field>
          <Field label="Máx. usuarios" id="plan-usuarios" error={errors.max_usuarios?.message}>
            <input id="plan-usuarios" type="number" min={0} step={1} {...register('max_usuarios')} className={inputClass} />
          </Field>
          <Field label="Máx. estudiantes" id="plan-estudiantes" error={errors.max_estudiantes?.message}>
            <input id="plan-estudiantes" type="number" min={0} step={1} {...register('max_estudiantes')} className={inputClass} />
          </Field>
        </div>
        <Field label="Descripción" id="plan-desc" error={errors.descripcion?.message}>
          <textarea id="plan-desc" {...register('descripcion')} rows={2} className={inputClass} />
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