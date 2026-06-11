import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export function ProductCardSkeleton({ className }: Props) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border bg-card', className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />

        <div className="mt-auto flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
