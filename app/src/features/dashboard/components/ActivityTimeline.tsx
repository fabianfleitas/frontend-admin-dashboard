import { History } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { EmptyState } from '@/components/feedback/EmptyState'

export function ActivityTimeline() {
  return (
    <Card className="space-y-4">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        Actividad reciente
      </h2>
      <EmptyState
        icon={<History size={18} />}
        title="No hay actividad reciente disponible."
        description="El backend aún no expone un endpoint de actividad unificada. Marcado como pendiente para Nivel 2."
      />
    </Card>
  )
}