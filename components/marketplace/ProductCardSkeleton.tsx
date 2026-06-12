import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export function ProductCardSkeleton({ className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm',
        className
      )}
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-1 p-2.5">
        <Skeleton className="h-2 w-12" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-0.5 h-2.5 w-16" />
        <div className="mt-1.5 flex items-center justify-between pt-0.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
