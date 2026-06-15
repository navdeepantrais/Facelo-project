import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/marketplace/ProductCardSkeleton'

export default function MarketplaceLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-0 md:gap-8">

        {/* Sidebar skeleton — desktop only */}
        <aside className="hidden md:block md:w-52 md:shrink-0">
          <div className="sticky top-16 py-8 space-y-1.5">
            <Skeleton className="mb-3 h-4 w-24 rounded" />
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 py-8 pb-16">

          {/* Category tabs skeleton — mobile only */}
          <div className="flex gap-2 overflow-hidden md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
            ))}
          </div>

          {/* Toolbar skeleton */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full rounded-xl sm:flex-1" />
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-10 w-[160px] rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
