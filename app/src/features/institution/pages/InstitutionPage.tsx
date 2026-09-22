import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, X } from 'lucide-react'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { useMe } from '@/features/auth/hooks/useMe'
import { useUpdateMe } from '@/features/auth/hooks/useUpdateMe'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Button } from '@/components/common/Button'

const profileSchema = z
  .object({
    full_name: z.string().trim().min(1, 'El nombre no puede quedar vacío').max(120),
  })
  .required()

type ProfileFormValues = z.infer<typeof profileSchema>

export function InstitutionPage() {
  const me = useMe()
  const updateMe = useUpdateMe()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { full_name: me.fullName ?? '' },
  })

  async function onSubmit(values: ProfileFormValues) {
    await updateMe.mutateAsync({ full_name: values.full_name })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Institución</h1>
        <p className="mt-1 text-sm text-muted-foreground">Perfil institucional y suscripción activa.</p>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle title="Perfil" description="Origen: GET /me" />
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-success">Guardado ✓</span>}
            {!editing ? (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <Pencil size={14} aria-hidden />
                Editar perfil
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                <X size={14} aria-hidden />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Nombre</span>
            {editing ? (
              <form
                className="mt-1 flex items-start gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  void handleSubmit(onSubmit)(e)
                }}
              >
                <div className="flex-1 space-y-1">
                  <input
                    autoFocus
                    {...register('full_name')}
                    className="h-9 w-full rounded-md border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Nombre y apellido"
                  />
                  {errors.full_name && (
                    <p className="text-xs text-danger">{errors.full_name.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={updateMe.isPending}>
                  {updateMe.isPending ? 'Guardando…' : 'Guardar'}
                </Button>
              </form>
            ) : (
              <div className="font-medium">{me.fullName ?? '—'}</div>
            )}
          </div>
          <div>
            <span className="text-muted-foreground">ID Institución</span>
            <div className="font-medium">{me.institucionId ?? '—'}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Institución</span>
            <div className="font-medium">{me.institucionNombre ?? '—'}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <div className="font-medium">{me.email ?? '—'}</div>
          </div>
        </div>
      </Card>

      <PagePlaceholder title="Configuración institucional" description="Edición avanzada pendiente en backend (Nivel 2)." />
    </div>
  )
}