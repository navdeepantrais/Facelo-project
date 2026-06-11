import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid, ProductGridSkeleton } from '@/components/marketplace/ProductGrid'
import { cn } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

type Props = {
  title: string
  seeAllHref?: string
  products: ProductWithCategory[]
  className?: string
}

type SkeletonProps = {
  title: string
  count?: number
  className?: string
}

export function MarketplaceSection({ title, seeAllHref, products, className }: Props) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products to show right now.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  )
}

export function MarketplaceSectionSkeleton({ title, count = 4, className }: SkeletonProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <ProductGridSkeleton count={count} />
    </section>
  )
}
