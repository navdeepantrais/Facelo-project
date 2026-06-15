'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

type Props = {
  categories: Category[]
  layout?: 'horizontal' | 'vertical'
}

export function CategoryTabs({ categories, layout = 'horizontal' }: Props) {
  const pathname = usePathname()

  const allProductsActive = pathname === '/marketplace'

  function isCategoryActive(slug: string) {
    return pathname === `/marketplace/${slug}`
  }

  if (layout === 'vertical') {
    return (
      <nav aria-label="Product categories">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-foreground mb-1 px-3 text-lg font-bold tracking-tight">Categories</h1>
          <Link
            href="/marketplace"
            className={cn(
              'flex w-full items-center rounded-lg border-l-2 px-3 py-2 text-sm transition-colors',
              allProductsActive
                ? 'border-violet-600 bg-violet-50 font-medium text-violet-700'
                : 'hover:bg-muted hover:text-foreground border-transparent text-gray-600'
            )}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/marketplace/${cat.slug}`}
              className={cn(
                'flex w-full items-center rounded-lg border-l-2 px-3 py-2 text-sm transition-colors',
                isCategoryActive(cat.slug)
                  ? 'border-violet-600 bg-violet-50 font-medium text-violet-700'
                  : 'hover:bg-muted hover:text-foreground border-transparent text-gray-600'
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2">
        <Link
          href="/marketplace"
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            allProductsActive
              ? 'bg-foreground text-background shadow-sm'
              : 'border-border bg-background text-foreground hover:bg-muted border'
          )}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/marketplace/${cat.slug}`}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              isCategoryActive(cat.slug)
                ? 'bg-foreground text-background shadow-sm'
                : 'border-border bg-background text-foreground hover:bg-muted border'
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
