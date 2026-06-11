interface AuthHeaderProps {
  title: string
  subtitle?: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
    </div>
  )
}
