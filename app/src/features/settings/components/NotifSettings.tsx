import { useState } from 'react'
import { Mail, Send, RefreshCw } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/features/dashboard/components/StatusBadge'
import { useSmtpConfig, useNotifications } from '../hooks/useSmtpConfig'
import { useUpdateSmtpConfig, useSendTestNotification } from '../hooks/useUpdateSmtpConfig'
import { toast } from '@/stores/toast.store'

export function NotifSettings() {
  const smtpQuery = useSmtpConfig()
  const notificationsQuery = useNotifications({ limit: 20 })
  const updateSmtp = useUpdateSmtpConfig()
  const sendTest = useSendTestNotification()

  const [servidor, setServidor] = useState('')
  const [puerto, setPuerto] = useState('587')
  const [cifrado, setCifrado] = useState('STARTTLS')
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [correo, setCorreo] = useState('')
  const [nombre, setNombre] = useState('')
  const [activo, setActivo] = useState(true)
  const [formInitialized, setFormInitialized] = useState(false)

  if (smtpQuery.isSuccess && !formInitialized) {
    const c = smtpQuery.data
    setServidor(c.servidor)
    setPuerto(String(c.puerto))
    setCifrado(c.cifrado)
    setUsuario(c.usuario ?? '')
    setCorreo(c.correo_remitente)
    setNombre(c.nombre_remitente ?? '')
    setActivo(c.activo)
    setFormInitialized(true)
  }

  function handleSave() {
    updateSmtp.mutate(
      {
        servidor,
        puerto: Number(puerto) || 587,
        cifrado,
        usuario: usuario || null,
        password: password || null,
        correo_remitente: correo,
        nombre_remitente: nombre || null,
        timeout_segundos: 30,
        activo,
      },
      {
        onSuccess: () => {
          setPassword('')
          toast.success('Configuración SMTP guardada.')
        },
        onError: (e: any) => toast.error('No fue posible guardar la configuración SMTP.', e?.detail ?? undefined),
      },
    )
  }

  function handleSendTest() {
    sendTest.mutate(
      { email: correo || 'admin@institucion.edu' },
      {
        onSuccess: (n) => {
          toast.success('Correo de prueba enviado', n.estado === 'SENT' ? 'Notificación marcada como SENT.' : 'La notificación quedó como ' + n.estado + '.')
        },
        onError: (e: any) => toast.error('No fue posible enviar el correo de prueba.', e?.detail ?? undefined),
      },
    )
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <SectionTitle title="Correo / SMTP" description="GET/PUT /api/admin/smtp — envío de notificaciones por email." />
        {smtpQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Servidor" value={servidor} onChange={setServidor} placeholder="smtp.example.com" />
            <Field label="Puerto" value={puerto} onChange={setPuerto} placeholder="587" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Cifrado</label>
              <select className="h-9 w-full rounded-md border bg-surface px-3 text-sm" value={cifrado} onChange={(e) => setCifrado(e.target.value)}>
                <option value="STARTTLS">STARTTLS</option>
                <option value="SSL">SSL</option>
                <option value="TLS">TLS</option>
                <option value="NONE">NONE</option>
              </select>
            </div>
            <Field label="Usuario" value={usuario} onChange={setUsuario} placeholder="Opcional" />
            <Field label="Contraseña" value={password} onChange={setPassword} placeholder="Solo si cambia" type="password" />
            <Field label="Correo remitente" value={correo} onChange={setCorreo} placeholder="no-reply@inst.edu" />
            <Field label="Nombre remitente" value={nombre} onChange={setNombre} placeholder="Opcional" />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
                Activo
              </label>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={updateSmtp.isPending || !servidor || !correo} className="gap-2">
            <Mail size={14} aria-hidden /> {updateSmtp.isPending ? 'Guardando…' : 'Guardar configuración'}
          </Button>
          <Button onClick={handleSendTest} disabled={sendTest.isPending || !servidor} variant="secondary" className="gap-2">
            <Send size={14} aria-hidden /> Enviar prueba
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionTitle title="Notificaciones" description="GET /api/admin/notifications — últimas enviadas." />
        {notificationsQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !notificationsQuery.data || notificationsQuery.data.items.length === 0 ? (
          <EmptyState icon={<Mail size={18} />} title="Sin notificaciones." description="Las notificaciones de pago/cancelación aparecerán aquí." />
        ) : (
          <ul className="divide-y rounded-lg border">
            {notificationsQuery.data.items.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{n.asunto ?? n.tipo}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.destinatario} · {n.created_at ? new Date(n.created_at).toLocaleString() : ''} {n.error ? `· ${n.error}` : ''}
                  </p>
                </div>
                <StatusBadge label={n.estado} tone={n.estado === 'SENT' ? 'success' : n.estado === 'FAILED' ? 'danger' : 'neutral'} />
              </li>
            ))}
          </ul>
        )}
        <Button variant="ghost" size="sm" onClick={() => notificationsQuery.refetch()} className="gap-2">
          <RefreshCw size={14} aria-hidden /> Actualizar
        </Button>
      </Card>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input className="h-9 w-full rounded-md border bg-surface px-3 text-sm focus:border-primary focus:outline-none" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}