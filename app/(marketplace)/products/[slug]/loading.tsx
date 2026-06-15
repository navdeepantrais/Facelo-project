import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image gallery skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="flex flex-col gap-5">
          {/* Badges */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          {/* Category */}
          <Skeleton className="h-4 w-28" />
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          {/* Brand */}
          <Skeleton className="h-4 w-24" />
          {/* Rating */}
          <Skeleton className="h-5 w-36" />
          {/* Price */}
          <Skeleton className="h-9 w-24" />
          {/* Divider */}
          <Skeleton className="h-px w-full" />
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {/* CTA */}
          <Skeleton className="h-11 w-full rounded-xl sm:w-48" />
        </div>
      </div>
    </div>
  )
}
