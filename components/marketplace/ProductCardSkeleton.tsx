import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export function ProductCardSkeleton({ className }: Props) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm', className)}>
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="mt-1 flex items-center justify-between pt-1.5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
