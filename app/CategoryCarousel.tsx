import Link from 'next/link'
import {
  CATEGORY_ICONS,
  CATEGORY_STYLES,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_STYLE,
} from '@/lib/category-icons'
import { cn } from '@/lib/utils'
import type { getCategories } from '@/lib/actions/marketplace'

type Category = Awaited<ReturnType<typeof getCategories>>[number]

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    /* Outer div scrolls when the row overflows; inner div centers itself via mx-auto when it fits */
    <div className="scrollbar-none overflow-x-auto">
      <div className="mx-auto flex w-max gap-3 pb-2">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug] ?? DEFAULT_CATEGORY_ICON
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
                <span className={cn('text-[11px] leading-tight font-semibold', style.cardText)}>
                  {cat.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
