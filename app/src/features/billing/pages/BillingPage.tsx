import { usePlan } from '../hooks/usePlan'
import { useSubscription } from '../hooks/usePlan'
import { usePagos } from '../hooks/usePagos'
import { useComprobantes } from '../hooks/useComprobantes'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { AlertTriangle } from 'lucide-react'

export function BillingPage() {
  const planQuery = usePlan()
  const subQuery = useSubscription()
  const pagosQuery = usePagos()
  const comprobantesQuery = useComprobantes()
  const loading = planQuery.isLoading || subQuery.isLoading
  const error = planQuery.isError || subQuery.isError

  const plan = planQuery.data
  const sub = subQuery.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Suscripción, pagos y comprobantes de la institución.</p>
      </div>

      {error ? (
        <ErrorState message="No fue posible cargar la información de billing." onRetry={() => { void planQuery.refetch(); void subQuery.refetch() }} />
      ) : (
        <>
          <Card className="space-y-3">
            <SectionTitle title="Plan" description="Origen: GET /api/admin/plan" />
            {loading ? <Skeleton className="h-24 w-full" /> : plan ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div><div className="text-xs text-muted-foreground">Nombre</div><div className="text-sm font-medium">{plan.nombre}</div></div>
                <div><div className="text-xs text-muted-foreground">Precio</div><div className="text-sm font-medium">{plan.precio} {plan.moneda}</div></div>
                <div><div className="text-xs text-muted-foreground">Intervalo</div><div className="text-sm font-medium">{plan.intervalo}</div></div>
                <div><div className="text-xs text-muted-foreground">Máx. documentos</div><div className="text-sm font-medium">{plan.max_documentos}</div></div>
                <div><div className="text-xs text-muted-foreground">Máx. usuarios</div><div className="text-sm font-medium">{plan.max_usuarios}</div></div>
                <div><div className="text-xs text-muted-foreground">Estado</div><div className="text-sm font-medium">{plan.activo ? 'Activo' : 'Inactivo'}</div></div>
              </div>
            ) : <div className="text-sm text-muted-foreground">Sin plan definido.</div>}
          </Card>

          <Card className="space-y-3">
            <SectionTitle title="Suscripción" description="Origen: GET /api/admin/subscription" />
            {loading ? <Skeleton className="h-24 w-full" /> : sub ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div><div className="text-xs text-muted-foreground">Estado</div><div className="text-sm font-medium">{sub.estado}</div></div>
                <div><div className="text-xs text-muted-foreground">Inicio</div><div className="text-sm font-medium">{sub.fecha_inicio}</div></div>
                <div><div className="text-xs text-muted-foreground">Vencimiento</div><div className="text-sm font-medium">{sub.fecha_vencimiento}</div></div>
                <div><div className="text-xs text-muted-foreground">Renovación</div><div className="text-sm font-medium">{sub.auto_renovacion ? 'Sí' : 'No'}</div></div>
                <div><div className="text-xs text-muted-foreground">Plan</div><div className="text-sm font-medium">{sub.plan?.nombre ?? '—'}</div></div>
              </div>
            ) : <div className="text-sm text-muted-foreground">Sin suscripción activa.</div>}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3">
              <SectionTitle title="Pagos" description="GET /api/admin/pagos" />
              {pagosQuery.isLoading ? <Skeleton className="h-24 w-full" /> : (
                <>
                  <table className="w-full text-sm"><thead><tr className="border-b"><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead><tbody>
                    {(pagosQuery.data?.items ?? []).map((p) => <tr key={p.id} className="border-b"><td>{p.fecha_pago}</td><td>{p.importe} {p.moneda}</td><td>{p.estado}</td></tr>)}
                  </tbody></table>
                  {pagosQuery.data && <Pagination total={pagosQuery.data.pagination.total} limit={20} offset={0} onPageChange={(_o: number) => {}} />}
                </>
              )}
            </Card>
            <Card className="space-y-3">
              <SectionTitle title="Comprobantes" description="GET /api/admin/comprobantes" />
              {comprobantesQuery.isLoading ? <Skeleton className="h-24 w-full" /> : (
                <>
                  <table className="w-full text-sm"><thead><tr className="border-b"><th>Tipo</th><th>Número</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
                    {(comprobantesQuery.data?.items ?? []).map((c) => <tr key={c.id} className="border-b"><td>{c.tipo_comprobante}</td><td>{c.numero}</td><td>{c.estado}</td><td>{c.fecha_emision}</td></tr>)}
                  </tbody></table>
                  {comprobantesQuery.data && <Pagination total={comprobantesQuery.data.pagination.total} limit={20} offset={0} onPageChange={(_o: number) => {}} />}
                </>
              )}
            </Card>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle size={12} /> Stripe checkout/portal pendiente en backend.</div>
        </>
      )}
    </div>
  )
}
