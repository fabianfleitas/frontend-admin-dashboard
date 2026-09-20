import { useState } from 'react'
import { usePlatformInstitutions } from '../hooks/usePlatformInstitutions'
import { useInstitutionMembers } from '../hooks/useInstitutionMembers'
import { useAddMember } from '../hooks/useAddMember'
import { useRemoveMember } from '../hooks/useRemoveMember'
import { usePlatformAudit } from '../hooks/usePlatformAudit'
import { usePlatformUsers } from '../hooks/usePlatformUsers'
import { usePlatformPlans } from '../hooks/usePlatformPlans'
import { usePlatformSubscriptions } from '../hooks/usePlatformSubscriptions'
import { usePlatformPagos } from '../hooks/usePlatformPagos'
import { usePlatformComprobantes } from '../hooks/usePlatformComprobantes'
import { InstitutionsDialog } from '../components/InstitutionsDialog'
import { PlansDialog } from '../components/PlansDialog'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Skeleton } from '@/components/feedback/Skeleton'
import { Pagination } from '@/components/common/Pagination'
import { AuditTable } from '@/features/audit/components/AuditTable'
import { UsersTable } from '@/features/users/components/UsersTable'
import { MetricsIA } from '@/features/dashboard/components/MetricsIA'
import { usePlatformMetrics } from '../hooks/usePlatformMetrics'
import { Eye, Trash2, Plus, Building2, BarChart3, ShieldCheck, Users, CreditCard, FileText, Landmark, Download } from 'lucide-react'
import { exportCsv } from '@/lib/download'

type Tab = 'institutions' | 'metrics' | 'audit' | 'users' | 'plans' | 'subscriptions' | 'pagos' | 'comprobantes'

export function PlatformPage() {
  const [tab, setTab] = useState<Tab>('institutions')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [newExt, setNewExt] = useState('')
  const [newType, setNewType] = useState('ESTUDIANTE')
  const [auditOffset, setAuditOffset] = useState(0)
  const [usersOffset, setUsersOffset] = useState(0)
  const [pagosOffset, setPagosOffset] = useState(0)
  const [comprobantesOffset, setComprobantesOffset] = useState(0)
  const [subsOffset, setSubsOffset] = useState(0)
  const [institutionsOpen, setInstitutionsOpen] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)

  const insts = usePlatformInstitutions()
  const members = useInstitutionMembers(selectedId)
  const add = useAddMember()
  const remove = useRemoveMember()
  const auditQ = usePlatformAudit({ limit: 20, offset: auditOffset })
  const usersQ = usePlatformUsers({ limit: 20, offset: usersOffset })
  const plansQ = usePlatformPlans()
  const subsQ = usePlatformSubscriptions({ limit: 20, offset: subsOffset })
  const pagosQ = usePlatformPagos({ limit: 20, offset: pagosOffset })
  const comprobantesQ = usePlatformComprobantes({ limit: 20, offset: comprobantesOffset })

  const metricsQ = usePlatformMetrics()
  const tabs = [
    { key: 'institutions' as Tab, label: 'Instituciones', icon: Building2 },
    { key: 'metrics' as Tab, label: 'Métricas', icon: BarChart3 },
    { key: 'audit' as Tab, label: 'Audit', icon: ShieldCheck },
    { key: 'users' as Tab, label: 'Usuarios', icon: Users },
    { key: 'plans' as Tab, label: 'Planes', icon: Landmark },
    { key: 'subscriptions' as Tab, label: 'Suscripciones', icon: CreditCard },
    { key: 'pagos' as Tab, label: 'Pagos', icon: CreditCard },
    { key: 'comprobantes' as Tab, label: 'Comprobantes', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Platform</h1>
        <p className="mt-1 text-sm text-muted-foreground">Consola de superadmin — instituciones, membresía y métricas globales.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-muted-foreground hover:bg-muted'}`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'institutions' && (
        <>
          <Card className="space-y-3">
            <SectionTitle
              title="Instituciones"
              description="GET /api/platform/institutions"
              action={
                <Button size="sm" variant="secondary" onClick={() => setInstitutionsOpen(true)}>
                  <Plus size={14} aria-hidden /> Gestionar instituciones
                </Button>
              }
            />
            {insts.isLoading ? <Skeleton className="h-24 w-full" /> : (
              <div className="overflow-auto">
                <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2 px-2">ID</th><th className="text-left py-2 px-2">Nombre</th><th className="text-left py-2 px-2">Estado</th><th className="py-2 px-2"></th></tr></thead>
                  <tbody>
                    {(insts.data ?? []).map((i) => (
                      <tr key={i.id} className="border-b hover:bg-muted/40"><td className="py-2 px-2">{i.id}</td><td className="py-2 px-2">{i.nombre}</td><td className="py-2 px-2">{i.activo ? 'Activo' : 'Inactivo'}</td><td className="py-2 px-2"><Button size="sm" variant="ghost" onClick={() => setSelectedId(i.id)}><Eye size={14} /></Button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          {selectedId && (
            <Card className="space-y-3">
              <SectionTitle title={`Miembros — Institución ${selectedId}`} description="GET /api/platform/institutions/{id}/members" />
              <div className="flex gap-2">
                <input className="h-8 w-48 rounded-md border px-2 text-xs" placeholder="external_auth_id" value={newExt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExt(e.target.value)} />
                <select className="h-8 rounded-md border px-2 text-xs" value={newType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewType(e.target.value)}>
                  <option value="ESTUDIANTE">Estudiante</option><option value="ADMIN">Admin</option><option value="SECRETARIA">Secretaria</option>
                </select>
                <Button size="sm" className="h-8" onClick={() => { if (newExt) add.mutate({ institutionId: selectedId, payload: { external_auth_id: newExt, tipo_miembro: newType } }); setNewExt(''); }}><Plus size={14} /></Button>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2 px-2">ID</th><th className="text-left py-2 px-2">Usuario</th><th className="text-left py-2 px-2">Tipo</th><th className="py-2 px-2"></th></tr></thead>
                  <tbody>
                    {(members.data ?? []).map((m) => (
                      <tr key={m.id} className="border-b"><td className="py-2 px-2">{m.id}</td><td className="py-2 px-2">{m.full_name ?? m.external_auth_id}</td><td className="py-2 px-2">{m.tipo_miembro}</td><td className="py-2 px-2"><Button size="sm" variant="ghost" onClick={() => remove.mutate({ institutionId: selectedId, memberId: m.id })}><Trash2 size={14} /></Button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {tab === 'metrics' && (
        <Card className="space-y-3">
          <SectionTitle
            title="Métricas globales"
            description="GET /api/platform/metrics"
            action={
              <Button variant="secondary" size="sm" onClick={() => void exportCsv('/api/platform/metrics/export', 'metrics.csv')}>
                <Download size={14} aria-hidden /> Exportar CSV
              </Button>
            }
          />
          {metricsQ.isLoading ? <Skeleton className="h-24 w-full" /> : metricsQ.data ? (
            <MetricsIA metrics={metricsQ.data} />
          ) : <div className="text-sm text-muted-foreground">Sin datos.</div>}
        </Card>
      )}

      {tab === 'audit' && (
        <>
          <div className="flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={() => void exportCsv('/api/platform/audit/export', 'audit.csv')}>
              <Download size={14} aria-hidden /> Exportar CSV
            </Button>
          </div>
          <AuditTable logs={auditQ.data?.items ?? []} loading={auditQ.isLoading} onSelect={() => {}} />
          {auditQ.data && <Pagination total={auditQ.data.pagination.total} limit={20} offset={auditOffset} onPageChange={(o) => setAuditOffset(o)} />}
        </>
      )}

      {tab === 'users' && (
        <>
          <UsersTable users={usersQ.data?.items ?? []} loading={usersQ.isLoading} />
          {usersQ.data && <Pagination total={usersQ.data.pagination.total} limit={20} offset={usersOffset} onPageChange={(o) => setUsersOffset(o)} />}
        </>
      )}

      {tab === 'plans' && (
        <Card className="space-y-3">
          <SectionTitle
            title="Planes"
            description="GET /api/platform/plans"
            action={
              <Button size="sm" variant="secondary" onClick={() => setPlansOpen(true)}>
                <Plus size={14} aria-hidden /> Gestionar planes
              </Button>
            }
          />
          <div className="grid gap-3 md:grid-cols-2">{(plansQ.data ?? []).map((p) => (
            <Card key={p.id} className="p-3 space-y-1"><div className="font-medium">{p.nombre}</div><div className="text-xs text-muted-foreground">{p.precio} {p.moneda} / {p.intervalo}</div><div className="text-xs">Máx. docs: {p.max_documentos} · usuarios: {p.max_usuarios}</div></Card>
          ))}</div>
        </Card>
      )}

      {tab === 'subscriptions' && (
        <>
          <table className="w-full text-sm"><thead><tr className="border-b"><th>Estado</th><th>Inicio</th><th>Plan</th></tr></thead><tbody>
            {(subsQ.data?.items ?? []).map((s) => <tr key={s.id} className="border-b"><td>{s.estado}</td><td>{s.fecha_inicio}</td><td>{s.plan?.nombre ?? '—'}</td></tr>)}
          </tbody></table>
          {subsQ.data && <Pagination total={subsQ.data.pagination.total} limit={20} offset={subsOffset} onPageChange={(o) => setSubsOffset(o)} />}
        </>
      )}

      {tab === 'pagos' && (
        <>
          <table className="w-full text-sm"><thead><tr className="border-b"><th>Fecha</th><th>Importe</th><th>Estado</th><th>Proveedor</th></tr></thead><tbody>
            {(pagosQ.data?.items ?? []).map((p) => <tr key={p.id} className="border-b"><td>{p.fecha_pago}</td><td>{p.importe} {p.moneda}</td><td>{p.estado}</td><td>{p.proveedor}</td></tr>)}
          </tbody></table>
          {pagosQ.data && <Pagination total={pagosQ.data.pagination.total} limit={20} offset={pagosOffset} onPageChange={(o) => setPagosOffset(o)} />}
        </>
      )}

      {tab === 'comprobantes' && (
        <>
          <div className="flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={() => void exportCsv('/api/platform/comprobantes/export', 'comprobantes.csv')}>
              <Download size={14} aria-hidden /> Exportar CSV
            </Button>
          </div>
          <table className="w-full text-sm"><thead><tr className="border-b"><th>Tipo</th><th>Número</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
            {(comprobantesQ.data?.items ?? []).map((c) => <tr key={c.id} className="border-b"><td>{c.tipo_comprobante}</td><td>{c.numero}</td><td>{c.estado}</td><td>{c.fecha_emision}</td></tr>)}
          </tbody></table>
          {comprobantesQ.data && <Pagination total={comprobantesQ.data.pagination.total} limit={20} offset={comprobantesOffset} onPageChange={(o) => setComprobantesOffset(o)} />}
        </>
      )}

      <InstitutionsDialog open={institutionsOpen} onClose={() => setInstitutionsOpen(false)} />
      <PlansDialog open={plansOpen} onClose={() => setPlansOpen(false)} />
    </div>
  )
}
