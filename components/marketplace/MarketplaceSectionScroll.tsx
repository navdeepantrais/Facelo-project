'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll'
import type { ProductWithCategory } from '@/types'

type Props = {
  products: ProductWithCategory[]
}

export function MarketplaceSectionScroll({ products }: Props) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy, onScroll } = useHorizontalScroll(320)

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy('left')}
          className="absolute top-1/2 -left-3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex scrollbar-none gap-4 overflow-x-auto pb-2"
      >
        {products.map((product) => (
          <div key={product.id} className="w-52 shrink-0 md:w-60">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy('right')}
          className="absolute top-1/2 -right-3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}
    </div>
  )
}
