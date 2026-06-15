'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_STYLES, DEFAULT_CATEGORY_ICON, DEFAULT_CATEGORY_STYLE } from '@/lib/category-icons'
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll'
import { cn } from '@/lib/utils'
import type { getCategories } from '@/lib/actions/marketplace'

type Category = Awaited<ReturnType<typeof getCategories>>[number]

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy, onScroll } = useHorizontalScroll(280)

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scrollBy('left')}
          className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:px-0"
      >
        {categories.map((cat) => {
          const Icon  = CATEGORY_ICONS[cat.slug]  ?? DEFAULT_CATEGORY_ICON
          const style = CATEGORY_STYLES[cat.slug] ?? DEFAULT_CATEGORY_STYLE
          return (
            <Link
              key={cat.id}
              href={`/marketplace/${cat.slug}`}
              className="group flex w-28 shrink-0 flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:border-violet-200 hover:shadow-md md:w-36"
            >
              <div
                className={cn(
                  'flex aspect-square items-center justify-center bg-gradient-to-br',
                  style.cardBg
                )}
              >
                <Icon
                  className={cn(
                    'h-8 w-8 transition-transform duration-200 group-hover:scale-110',
                    style.cardIcon
                  )}
                  aria-hidden="true"
                />
              </div>
              <div className="px-2 py-2.5 text-center">
                <span className={cn('text-[11px] font-semibold leading-tight', style.cardText)}>
                  {cat.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scrollBy('right')}
          className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}
    </div>
  )
}
