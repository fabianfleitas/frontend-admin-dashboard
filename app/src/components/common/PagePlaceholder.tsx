interface PagePlaceholderProps {
  title: string
  description?: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed bg-surface p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo pendiente de implementación. Ver plan de sprints en <code>AGENTS.md</code>.
        </p>
      </div>
    </div>
  )
}