import { useState, useEffect } from 'react'
import { usePlan } from '../hooks/usePlan'
import { useSubscription } from '../hooks/usePlan'
import { usePagos } from '../hooks/usePagos'
import { useComprobantes } from '../hooks/useComprobantes'
import { useStripeSubscription } from '../hooks/useStripeSubscription'
import { useSubscriptionHistory } from '../hooks/useSubscriptionHistory'
import { useCheckoutSession } from '../hooks/useCheckoutSession'
import { usePortalSession } from '../hooks/usePortalSession'
import { useCancelSubscription } from '../hooks/useCancelSubscription'
import { useReactivateSubscription } from '../hooks/useReactivateSubscription'
import { useSyncPlan } from '../hooks/useSyncPlan'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Skeleton } from '@/components/feedback/Skeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { toast } from '@/stores/toast.store'
import { isNotFound } from '@/lib/http'
import { CreditCard, Trash2, RefreshCcw, ExternalLink, Zap } from 'lucide-react'

export function BillingPage() {
  const [cancelOpen, setCancelOpen] = useState(false)
  const [historyOffset, setHistoryOffset] = useState(0)
  const [pagosOffset, setPagosOffset] = useState(0)
  const [comprobantesOffset, setComprobantesOffset] = useState(0)

  const planQuery = usePlan()
  const subQuery = useSubscription()
  const pagosQuery = usePagos({ limit: 20, offset: pagosOffset })
  const comprobantesQuery = useComprobantes({ limit: 20, offset: comprobantesOffset })
  const stripeSub = useStripeSubscription()
  const stripeHistory = useSubscriptionHistory({ limit: 20, offset: historyOffset })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stripeStatus = params.get('stripe')
    if (stripeStatus === 'success') {
      toast.success('Pago completado', 'Tu suscripción ha sido activada.')
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (stripeStatus === 'cancelled') {
      toast.info('Pago cancelado', 'No se realizó ningún cargo.')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const checkout = useCheckoutSession()
  const portal = usePortalSession()
  const cancelSub = useCancelSubscription()
  const reactivate = useReactivateSubscription()
  const syncPlan = useSyncPlan()

  const loading = planQuery.isLoading || subQuery.isLoading || stripeSub.isLoading
  const error = (planQuery.isError && !isNotFound(planQuery.error)) || (subQuery.isError && !isNotFound(subQuery.error))

  const plan = planQuery.data
  const sub = subQuery.data
  const stripeSubscription = stripeSub.data

  const handleCheckout = () => {
    if (!plan) return
    const url = `${window.location.origin}/billing?stripe=success`
    const cancelUrl = `${window.location.origin}/billing?stripe=cancelled`
    checkout.mutate(
      { plan_id: plan.id, success_url: url, cancel_url: cancelUrl },
      {
        onSuccess: (data) => {
          if (data.url) window.location.href = data.url
        },
        onError: (e: any) => toast.error('Error en checkout', e?.detail ?? 'Revisa que el plan esté sincronizado con Stripe.'),
      },
    )
  }

  const handlePortal = () => {
    portal.mutate(
      { return_url: window.location.origin + '/billing' },
      {
        onSuccess: (data) => {
          if (data.url) window.location.href = data.url
        },
        onError: (e: any) => toast.error('Error al abrir portal', e?.detail ?? 'Intenta de nuevo.'),
      },
    )
  }

  const handleCancel = () => {
    cancelSub.mutate({ cancel_at_period_end: true }, { onSuccess: () => setCancelOpen(false) })
  }

  const handleReactivate = () => {
    reactivate.mutate()
  }

  const handleSyncPlan = () => {
    if (!plan) return
    syncPlan.mutate({ plan_id: plan.id })
  }

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
            <SectionTitle title="Suscripción institucional" description="Origen: GET /api/admin/subscription" />
            {loading ? <Skeleton className="h-24 w-full" /> : sub ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div><div className="text-xs text-muted-foreground">Estado</div><div className="text-sm font-medium">{sub.estado}</div></div>
                <div><div className="text-xs text-muted-foreground">Inicio</div><div className="text-sm font-medium">{sub.fecha_inicio}</div></div>
                <div><div className="text-xs text-muted-foreground">Vencimiento</div><div className="text-sm font-medium">{sub.fecha_vencimiento}</div></div>
                <div><div className="text-xs text-muted-foreground">Renovación</div><div className="text-sm font-medium">{sub.auto_renovacion ? 'Sí' : 'No'}</div></div>
                <div><div className="text-xs text-muted-foreground">Plan</div><div className="text-sm font-medium">{sub.plan?.nombre ?? '—'}</div></div>
                <div><div className="text-xs text-muted-foreground">Stripe Sub</div><div className="text-sm font-medium truncate">{sub.stripe_subscription_id ?? '—'}</div></div>
              </div>
            ) : <div className="text-sm text-muted-foreground">Sin suscripción activa.</div>}
          </Card>

          {/* Stripe subscription status */}
          <Card className="space-y-3">
            <SectionTitle title="Estado Stripe" description="Origen: GET /api/admin/stripe/subscription" />
            {stripeSub.isLoading ? <Skeleton className="h-24 w-full" /> : stripeSubscription ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div><div className="text-xs text-muted-foreground">Status</div><div className="text-sm font-medium">{stripeSubscription.status ?? '—'}</div></div>
                <div><div className="text-xs text-muted-foreground">Cancelación al período</div><div className="text-sm font-medium">{stripeSubscription.cancel_at_period_end ? 'Sí' : 'No'}</div></div>
                <div><div className="text-xs text-muted-foreground">Período inicio</div><div className="text-sm font-medium">{stripeSubscription.current_period_start ?? '—'}</div></div>
                <div><div className="text-xs text-muted-foreground">Período fin</div><div className="text-sm font-medium">{stripeSubscription.current_period_end ?? '—'}</div></div>
                <div><div className="text-xs text-muted-foreground">Última factura</div><div className="text-sm font-medium">{stripeSubscription.latest_invoice_payment_intent_id ?? '—'}</div></div>
                <div><div className="text-xs text-muted-foreground">Estado factura</div><div className="text-sm font-medium">{stripeSubscription.latest_invoice_status ?? '—'}</div></div>
              </div>
            ) : stripeSub.isError ? (
              isNotFound(stripeSub.error) ? (
                <div className="text-sm text-muted-foreground">No hay suscripción activa en Stripe.</div>
              ) : (
                <div className="text-sm text-danger">Error al consultar Stripe: {String(stripeSub.error)}</div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">No hay suscripción activa en Stripe.</div>
            )}
          </Card>

          {/* Actions */}
          <Card className="space-y-3">
            <SectionTitle title="Acciones de billing" description="Endpoints Stripe institucionales" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCheckout} disabled={checkout.isPending || !plan} className="gap-2">
                <CreditCard size={14} /> Pagar / Suscribirse
              </Button>
              <Button onClick={handlePortal} disabled={portal.isPending} variant="secondary" className="gap-2">
                <ExternalLink size={14} /> Portal de Stripe
              </Button>
              <Button onClick={() => setCancelOpen(true)} disabled={cancelSub.isPending || !stripeSubscription} variant="danger" className="gap-2">
                <Trash2 size={14} /> Cancelar suscripción
              </Button>
              {stripeSubscription?.cancel_at_period_end && (
                <Button onClick={handleReactivate} disabled={reactivate.isPending} variant="secondary" className="gap-2">
                  <RefreshCcw size={14} /> Reactivar
                </Button>
              )}
              <Button onClick={handleSyncPlan} disabled={syncPlan.isPending || !plan} variant="ghost" className="gap-2">
                <Zap size={14} /> Sincronizar plan con Stripe
              </Button>
              <Button disabled variant="secondary" className="gap-2 opacity-60" title="Requiere GET /api/admin/plans (pendiente backend)">Cambiar plan</Button>
            </div>
          </Card>

          {/* Subscription history */}
          <Card className="space-y-3">
            <SectionTitle title="Historial de suscripción" description="GET /api/admin/subscription/history" />
            {stripeHistory.isLoading ? <Skeleton className="h-24 w-full" /> : (
              <>
                <table className="w-full text-sm"><thead><tr className="border-b"><th>Evento</th><th>Estado anterior</th><th>Estado nuevo</th><th>Plan anterior</th><th>Plan nuevo</th><th>Fecha</th></tr></thead><tbody>
                  {(stripeHistory.data?.items ?? []).map((h) => (
                    <tr key={h.id} className="border-b"><td>{h.tipo_evento ?? '—'}</td><td>{h.estado_anterior ?? '—'}</td><td>{h.estado_nuevo ?? '—'}</td><td>{h.plan_anterior_id ?? '—'}</td><td>{h.plan_nuevo_id ?? '—'}</td><td>{h.created_at ? new Date(h.created_at).toLocaleDateString() : '—'}</td></tr>
                  ))}
                </tbody></table>
                {stripeHistory.data && <Pagination total={stripeHistory.data.pagination.total} limit={20} offset={historyOffset} onPageChange={(o) => setHistoryOffset(o)} />}
              </>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3">
              <SectionTitle title="Pagos" description="GET /api/admin/pagos" />
              {pagosQuery.isLoading ? <Skeleton className="h-24 w-full" /> : (
                <>
                  <table className="w-full text-sm"><thead><tr className="border-b"><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead><tbody>
                    {(pagosQuery.data?.items ?? []).map((p) => <tr key={p.id} className="border-b"><td>{p.fecha_pago}</td><td>{p.importe} {p.moneda}</td><td>{p.estado}</td></tr>)}
                  </tbody></table>
                  {pagosQuery.data && <Pagination total={pagosQuery.data.pagination.total} limit={20} offset={pagosOffset} onPageChange={(o) => setPagosOffset(o)} />}
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
                  {comprobantesQuery.data && <Pagination total={comprobantesQuery.data.pagination.total} limit={20} offset={comprobantesOffset} onPageChange={(o) => setComprobantesOffset(o)} />}
                </>
              )}
            </Card>
          </div>

          {/* Cancel confirmation modal */}
          <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Confirmar cancelación" description="Se cancelará la suscripción al finalizar el período actual.">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>¿Estás seguro de que deseas cancelar la suscripción en Stripe?</p>
              <p>Esto no borra el pago ya realizado; solo preventirá la renovación.</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setCancelOpen(false)}>Cancelar</Button>
              <Button variant="danger" size="sm" onClick={handleCancel} disabled={cancelSub.isPending}>{cancelSub.isPending ? 'Procesando...' : 'Confirmar cancelación'}</Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
