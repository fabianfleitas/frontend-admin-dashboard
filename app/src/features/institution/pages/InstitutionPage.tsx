import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { useMe } from '@/features/auth/hooks/useMe'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'

export function InstitutionPage() {
  const me = useMe()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Institución</h1>
        <p className="mt-1 text-sm text-muted-foreground">Perfil institucional y suscripción activa.</p>
      </div>
      <Card className="space-y-3">
        <SectionTitle title="Perfil" description="Origen: GET /me" />
        <div className="grid gap-2 text-sm"><div><span className="text-muted-foreground">Nombre</span><div className="font-medium">{(me.profile as any)?.nombre_institucion ?? me.profile?.full_name ?? '—'}</div></div><div><span className="text-muted-foreground">ID Institución</span><div className="font-medium">{(me.profile as any)?.institucion_id ?? '—'}</div></div><div><span className="text-muted-foreground">Email</span><div className="font-medium">{(me.profile as any)?.email ?? '—'}</div></div></div>
      </Card>
      <PagePlaceholder title="Configuración institucional" description="Edición avanzada pendiente en backend (Nivel 2)." />
    </div>
  )
}