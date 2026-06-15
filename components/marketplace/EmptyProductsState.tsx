type Props = {
  title: string
  subtitle: string
}

export function EmptyProductsState({ title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-24 text-center shadow-sm">
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
