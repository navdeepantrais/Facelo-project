import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid, ProductGridSkeleton } from '@/components/marketplace/ProductGrid'
import { MarketplaceSectionScroll } from '@/components/marketplace/MarketplaceSectionScroll'
import { cn } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

type Props = {
  title: string
  seeAllHref?: string
  products: ProductWithCategory[]
  className?: string
  /** When true, renders a horizontal scroll carousel on all breakpoints */
  scroll?: boolean
}

type SkeletonProps = {
  title: string
  count?: number
  className?: string
}

export function MarketplaceSection({
  title,
  seeAllHref,
  products,
  className,
  scroll = false,
}: Props) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">No products to show right now.</p>
      ) : scroll ? (
        <>
          {/* Mobile: normal 2-col grid — no horizontal overflow */}
          <div className="md:hidden">
            <ProductGrid products={products.slice(0, 4)} />
          </div>
          {/* Tablet+: horizontal scroll carousel with arrows */}
          <div className="hidden overflow-x-clip md:block">
            <MarketplaceSectionScroll products={products} />
          </div>
        </>
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
