import { useNavigate } from 'react-router-dom'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { Drawer } from '@/components/common/Drawer'
import { Button } from '@/components/common/Button'
import { SectionTitle } from '@/components/common/SectionTitle'
import { formatDate } from '@/lib/utils'
import type { AuditLogOut } from '../types'

interface AuditDrawerProps {
  log: AuditLogOut | null
  onClose: () => void
}

function scoreTone(value: number | null): string {
  if (value === null) return 'text-muted-foreground'
  if (value >= 0.85) return 'text-success'
  if (value >= 0.6) return 'text-warning'
  return 'text-danger'
}

export function AuditDrawer({ log, onClose }: AuditDrawerProps) {
  const navigate = useNavigate()
  const open = log !== null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Registro de auditoría"
      description={log ? `Mensaje #${log.mensaje_id}` : undefined}
      size="lg"
      footer={
        log ? (
          <Button variant="secondary" onClick={() => navigate('/conversations')}>
            <ExternalLink size={14} aria-hidden />
            Ver conversación relacionada
          </Button>
        ) : undefined
      }
    >
      {!log ? (
        <p className="text-sm text-muted-foreground">No se seleccionó ningún registro.</p>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3">
            <SectionTitle title="Información general" />
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="break-all font-mono text-xs text-foreground">{log.id}</dd>
              <dt className="text-muted-foreground">Mensaje ID</dt>
              <dd className="font-mono text-foreground">#{log.mensaje_id}</dd>
              <dt className="text-muted-foreground">Fecha evaluación</dt>
              <dd className="font-medium text-foreground">
                {formatDate(log.fecha_evaluacion)}
              </dd>
            </dl>
          </section>

          <section className="space-y-3">
            <SectionTitle title="Scores de evaluación" />
            <div className="grid grid-cols-3 gap-3">
              <ScoreCard label="Fidelidad" value={log.score_fidelidad} />
              <ScoreCard label="Relevancia" value={log.score_relevancia} />
              <ScoreCard label="Contexto" value={log.score_contexto} />
            </div>
          </section>

          {log.observaciones && (
            <section className="space-y-2">
              <SectionTitle title="Observaciones" />
              <p className="rounded-md border bg-muted/30 px-4 py-3 text-sm text-foreground">
                {log.observaciones}
              </p>
            </section>
          )}

          <section className="space-y-2 rounded-md border border-dashed bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldCheck size={14} aria-hidden />
              Acceder al contexto completo
            </div>
            <p className="text-xs text-muted-foreground">
              El endpoint <code>GET /api/admin/audit</code> retorna scores y observaciones pero no
              incluye prompt, respuesta, usuario ni latencia. Para ver el contenido del mensaje
              completo, abre el módulo Conversations y busca el mensaje #{log.mensaje_id}.
            </p>
          </section>
        </div>
      )}
    </Drawer>
  )
}

function ScoreCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-md border bg-surface px-3 py-2 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${scoreTone(value)}`}>
        {value !== null ? `${Math.round(value * 100)}%` : '—'}
      </p>
    </div>
  )
}