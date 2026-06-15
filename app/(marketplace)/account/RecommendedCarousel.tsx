'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll'
import type { getFeaturedProducts } from '@/lib/actions/marketplace'

type Product = Awaited<ReturnType<typeof getFeaturedProducts>>[number]

export default function RecommendedCarousel({ products }: { products: Product[] }) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy, onScroll } = useHorizontalScroll()

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy('left')}
          className="absolute top-[40%] left-0 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex scrollbar-none gap-3 overflow-x-auto pb-2"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="144px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-violet-100 to-indigo-100" />
              )}
            </div>
            <div className="p-2.5">
              {product.category && (
                <p className="mb-0.5 text-[9px] font-bold tracking-wider text-violet-500 uppercase">
                  {product.category.name}
                </p>
              )}
              <p className="line-clamp-2 text-xs leading-tight font-semibold text-gray-900">
                {product.name}
              </p>
              <p className="mt-1 text-xs font-bold text-gray-900">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy('right')}
          className="absolute top-[40%] right-0 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}
    </div>
  )
}
