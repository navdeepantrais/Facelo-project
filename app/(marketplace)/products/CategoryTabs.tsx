'use client'

import { cn } from '@/lib/utils'
import { useUrlParams } from '@/hooks/use-url-params'
import type { Category } from '@/types'

type Props = {
  categories: Category[]
}

export function CategoryTabs({ categories }: Props) {
  const { searchParams, setParam } = useUrlParams()
  const currentCategory = searchParams.get('category') ?? ''

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2">
        <button
          onClick={() => setParam('category', '')}
          className={cn(
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
            !currentCategory
              ? 'bg-foreground text-background shadow-sm'
              : 'border border-border bg-background text-foreground hover:bg-muted'
          )}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setParam('category', currentCategory === cat.slug ? '' : cat.slug)}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
              currentCategory === cat.slug
                ? 'bg-foreground text-background shadow-sm'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
