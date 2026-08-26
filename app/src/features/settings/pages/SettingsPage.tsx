import { useState } from 'react'
import { useReady } from '@/features/dashboard/hooks/useReady'
import { useMetrics } from '@/features/dashboard/hooks/useMetrics'
import { useConfig } from '../hooks/useConfig'
import { useUpdateConfig } from '../hooks/useUpdateConfig'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import { Button } from '@/components/common/Button'
import { Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function SettingsPage() {
  const readyQuery = useReady()
  const metricsQuery = useMetrics()
  const configQuery = useConfig()
  const updateConfig = useUpdateConfig()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const ready = readyQuery.data
  const metrics = metricsQuery.data
  const config = configQuery.data ?? []
  const loading = readyQuery.isLoading || metricsQuery.isLoading || configQuery.isLoading
  const isError = readyQuery.isError || metricsQuery.isError || configQuery.isError

  const editable = config.filter((c) => c.editable_desde_dashboard)
  const readOnly = config.filter((c) => !c.editable_desde_dashboard)

  function startEdit(c: typeof config[0]) {
    setEditingKey(c.clave)
    setEditValue(c.valor)
  }

  function saveEdit(clave: string) {
    updateConfig.mutate(
      { clave, body: { clave, valor: editValue } },
      { onSuccess: () => setEditingKey(null) },
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuración del sistema. Parámetros editables según <code>editable_desde_dashboard</code>.
        </p>
      </div>

      {isError ? (
        <ErrorState message="No fue posible obtener la información del sistema." onRetry={() => { void readyQuery.refetch(); void metricsQuery.refetch(); void configQuery.refetch() }} />
      ) : (
        <>
          <Card className="space-y-3">
            <SectionTitle title="Estado del sistema" description="Origen: GET /ready + GET /api/admin/metrics" />
            {loading ? <Skeleton className="h-8 w-full" /> : (
              <>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Estado global</span><span className="text-sm font-medium">{ready?.status ?? metrics?.system_status ?? '—'}</span></div>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Servicios</span><StatusBadge label={ready?.status === 'ready' ? 'Operativo' : 'Con limitaciones'} tone={ready?.status === 'ready' ? 'success' : 'warning'} /></div>
                {ready?.services && Object.entries(ready.services).map(([key, ok]) => (
                  <div key={key} className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-0"><span className="text-sm text-muted-foreground">{key}</span><span className="text-sm font-medium">{ok ? 'Online' : 'Offline'}</span></div>
                ))}
              </>
            )}
          </Card>

          <Card className="space-y-3">
            <SectionTitle title="Agregados del sistema" description="Origen: GET /api/admin/metrics" />
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Total consultas</span><span className="text-sm font-medium">{metrics?.total_queries ?? '—'}</span></div>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Total conversaciones</span><span className="text-sm font-medium">{metrics?.total_conversations ?? '—'}</span></div>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Total documentos</span><span className="text-sm font-medium">{metrics?.total_documents ?? '—'}</span></div>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Total feedbacks</span><span className="text-sm font-medium">{metrics?.total_feedbacks ?? '—'}</span></div>
                <div className="flex items-center justify-between gap-3 border-b px-3 py-2"><span className="text-sm text-muted-foreground">Fecha consulta</span><span className="text-sm font-medium">{formatDate(new Date().toISOString())}</span></div>
              </>
            )}
          </Card>

          <section className="space-y-3">
            <SectionTitle title="Configuración institucional" description="GET /api/admin/config — editables según dashboard." />
            <div className="grid gap-4 md:grid-cols-2">
              {editable.map((c) => (
                <Card key={c.clave} className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium">{c.clave}</h3>
                      <p className="text-xs text-muted-foreground">{c.tipo} · {c.descripcion ?? '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Editable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingKey === c.clave ? (
                      <>
                        <input className="h-8 w-full rounded-md border px-2 text-xs" value={editValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)} />
                        <Button size="sm" onClick={() => saveEdit(c.clave)} disabled={updateConfig.isPending} className="h-8 px-2"><Check size={14} /></Button>
                      </>
                    ) : (
                      <>
                        <span className="truncate text-sm font-medium">{c.valor}</span>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(c)} className="h-8 px-2 text-xs">Editar</Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
              {readOnly.map((c) => (
                <Card key={c.clave} className="space-y-2 p-3 opacity-80">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium">{c.clave}</h3>
                      <p className="text-xs text-muted-foreground">{c.tipo} · {c.descripcion ?? '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Solo lectura</span>
                  </div>
                  <div className="text-sm font-medium">{c.valor}</div>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
