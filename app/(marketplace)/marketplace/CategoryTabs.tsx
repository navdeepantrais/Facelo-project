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
          <h1 className="mb-1 px-3 text-lg font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <Link
            href="/marketplace"
            className={cn(
              'flex w-full items-center rounded-lg border-l-2 px-3 py-2 text-sm transition-colors',
              allProductsActive
                ? 'border-violet-600 bg-violet-50 font-medium text-violet-700'
                : 'border-transparent text-gray-600 hover:bg-muted hover:text-foreground'
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
                  : 'border-transparent text-gray-600 hover:bg-muted hover:text-foreground'
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
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
            allProductsActive
              ? 'bg-foreground text-background shadow-sm'
              : 'border border-border bg-background text-foreground hover:bg-muted'
          )}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/marketplace/${cat.slug}`}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isCategoryActive(cat.slug)
                ? 'bg-foreground text-background shadow-sm'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
