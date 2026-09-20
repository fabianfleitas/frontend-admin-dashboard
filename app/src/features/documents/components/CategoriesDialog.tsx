import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderTree, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import { useCategories } from '../hooks/useCategories'
import { useCreateCategory } from '../hooks/useCreateCategory'
import { useUpdateCategory } from '../hooks/useUpdateCategory'
import { useDeleteCategory } from '../hooks/useDeleteCategory'
import { categorySchema, type CategoryFormResolved, type CategoryFormValues } from '../schemas/category.schema'
import type { CategoryOut } from '../types'
import { toast } from '@/stores/toast.store'

interface CategoriesDialogProps {
  open: boolean
  onClose: () => void
}

interface CategoryFormModalProps {
  open: boolean
  onClose: () => void
  editing: CategoryOut | null
}

export function CategoriesDialog({ open, onClose }: CategoriesDialogProps) {
  const categoriesQuery = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryOut | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<CategoryOut | null>(null)
  const deleteCategory = useDeleteCategory()

  function handleEdit(category: CategoryOut) {
    setEditing(category)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!confirmDelete) return
    try {
      await deleteCategory.mutateAsync(confirmDelete.id)
      toast.success('Categoría desactivada.')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(
        'No fue posible desactivar la categoría.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar categorías"
      description="Las categorías clasifican los documentos de la base de conocimiento."
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
            El backend expone CRUD completo sobre categorías. Al desactivar una categoría, esta deja
            de estar disponible en el selector de carga de documentos.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={14} aria-hidden />
            Nueva categoría
          </Button>
        </div>

        {categoriesQuery.isError ? (
          <ErrorState
            message="No fue posible cargar las categorías."
            onRetry={() => categoriesQuery.refetch()}
          />
        ) : categoriesQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !categoriesQuery.data || categoriesQuery.data.items.length === 0 ? (
          <EmptyState
            icon={<FolderTree size={18} />}
            title="No existen categorías."
            description="Crea la primera categoría para clasificar tus documentos."
          />
        ) : (
          <ul className="divide-y rounded-lg border">
            {categoriesQuery.data.items.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{category.nombre}</p>
                    <StatusBadge
                      label={category.activo ? 'Activa' : 'Inactiva'}
                      tone={category.activo ? 'success' : 'neutral'}
                    />
                  </div>
                  {category.descripcion && (
                    <p className="truncate text-xs text-muted-foreground">{category.descripcion}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    aria-label={`Editar categoría ${category.nombre}`}
                  >
                    <Pencil size={14} aria-hidden />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(category)}
                    disabled={!category.activo}
                    aria-label={`Desactivar categoría ${category.nombre}`}
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

      {formOpen && (
        <CategoryFormModal
          open={formOpen}
          onClose={handleCloseForm}
          editing={editing}
        />
      )}

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Desactivar categoría"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteCategory.isPending}>
              {deleteCategory.isPending ? 'Desactivando…' : 'Desactivar'}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={20} aria-hidden />
          <p className="text-sm text-muted-foreground">
            La categoría <span className="font-medium text-foreground">{confirmDelete?.nombre}</span>{' '}
            se marcará como inactiva y dejará de aparecer en el selector de documentos. No se
            eliminan los documentos asociados.
          </p>
        </div>
      </Modal>
    </Modal>
  )
}

function CategoryFormModal({ open, onClose, editing }: CategoryFormModalProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const createPending = createCategory.isPending
  const updatePending = updateCategory.isPending
  const pending = createPending || updatePending
  const isEditing = editing !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombre: editing?.nombre ?? '',
      descripcion: editing?.descripcion ?? '',
    },
  })

  function handleClose() {
    reset()
    onClose()
  }

  async function onSubmit(values: CategoryFormResolved) {
    const input = { nombre: values.nombre, descripcion: values.descripcion || null }
    try {
      if (isEditing && editing) {
        await updateCategory.mutateAsync({ categoriaId: editing.id, input })
        toast.success('Categoría actualizada.')
      } else {
        await createCategory.mutateAsync(input)
        toast.success('Categoría creada.')
      }
      handleClose()
    } catch (err) {
      toast.error(
        isEditing ? 'No fue posible actualizar la categoría.' : 'No fue posible crear la categoría.',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar categoría' : 'Nueva categoría'}
      size="sm"
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
            {pending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="category-nombre">
            Nombre *
          </label>
          <input
            id="category-nombre"
            {...register('nombre')}
            className="h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none"
            placeholder="Ej. Reglamentos"
          />
          {errors.nombre && <p className="text-xs text-danger">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="category-descripcion"
          >
            Descripción
          </label>
          <textarea
            id="category-descripcion"
            {...register('descripcion')}
            rows={2}
            className="w-full rounded-md border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="Opcional"
          />
          {errors.descripcion && <p className="text-xs text-danger">{errors.descripcion.message}</p>}
        </div>
      </form>
    </Modal>
  )
}