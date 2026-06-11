import { ProductCard } from '@/components/marketplace/ProductCard'
import { ProductCardSkeleton } from '@/components/marketplace/ProductCardSkeleton'
import { cn } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

const GRID_CLASSES =
  'grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'

type Props = {
  products: ProductWithCategory[]
  className?: string
}

type SkeletonProps = {
  count?: number
  className?: string
}

export function ProductGrid({ products, className }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }

  return (
    <div className={cn(GRID_CLASSES, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, className }: SkeletonProps) {
  return (
    <div className={cn(GRID_CLASSES, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
