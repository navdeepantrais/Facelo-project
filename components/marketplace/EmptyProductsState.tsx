type Props = {
  title: string
  subtitle: string
}

export function EmptyProductsState({ title, subtitle }: Props) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-24 text-center shadow-sm">
      <p className="text-foreground text-lg font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
    </div>
  )
}
