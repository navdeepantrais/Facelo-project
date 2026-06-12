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
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
          <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 transition-colors hover:bg-violet-100"
          >
            See all <ArrowRight className="h-2.5 w-2.5" />
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
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <div className="h-4 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>
      </div>
      <ProductGridSkeleton count={count} />
    </section>
  )
}
