import { ProductCardSkeleton } from '@/components/marketplace/ProductCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoryPageLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-0 md:gap-8">
        {/* Sidebar skeleton — desktop only */}
        <aside className="hidden md:block md:w-52 md:shrink-0">
          <div className="sticky top-16 space-y-1.5 py-8">
            <Skeleton className="mb-3 h-4 w-24 rounded" />
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6 py-8 pb-16">
          {/* Category banner skeleton */}
          <Skeleton className="h-28 w-full rounded-2xl" />

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
