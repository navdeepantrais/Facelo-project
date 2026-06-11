'use client'

import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUrlParams } from '@/hooks/use-url-params'
import type { Category } from '@/types'

type Props = {
  categories: Category[]
  className?: string
}

export function FilterSidebar({ categories, className }: Props) {
  const { searchParams, setParam, removeParams } = useUrlParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentMinPrice = searchParams.get('minPrice') ?? ''
  const currentMaxPrice = searchParams.get('maxPrice') ?? ''
  const currentRating = searchParams.get('rating') ?? ''

  function clearAll() {
    removeParams('category', 'minPrice', 'maxPrice', 'rating')
  }

  const hasActiveFilters = !!(currentCategory || currentMinPrice || currentMaxPrice || currentRating)

  return (
    <aside className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">Category</h4>
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => setParam('category', '')}
              className={cn(
                'w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors hover:bg-muted',
                !currentCategory && 'bg-muted font-medium text-primary'
              )}
            >
              All categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setParam('category', cat.slug)}
                className={cn(
                  'w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors hover:bg-muted',
                  currentCategory === cat.slug && 'bg-muted font-medium text-primary'
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Price range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium">Price range</h4>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Min ($)
            </Label>
            <Input
              id="minPrice"
              type="number"
              min={0}
              placeholder="0"
              defaultValue={currentMinPrice}
              onBlur={(e) => setParam('minPrice', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setParam('minPrice', (e.target as HTMLInputElement).value)
              }}
              className="h-8 text-sm"
            />
          </div>
          <span className="mt-5 text-muted-foreground">–</span>
          <div className="flex flex-col gap-1 flex-1">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Max ($)
            </Label>
            <Input
              id="maxPrice"
              type="number"
              min={0}
              placeholder="Any"
              defaultValue={currentMaxPrice}
              onBlur={(e) => setParam('maxPrice', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setParam('maxPrice', (e.target as HTMLInputElement).value)
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Minimum rating */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">Minimum rating</h4>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2].map((r) => (
            <Button
              key={r}
              size="sm"
              variant={currentRating === String(r) ? 'default' : 'outline'}
              onClick={() => setParam('rating', currentRating === String(r) ? '' : String(r))}
              className="text-xs"
            >
              {r}+ ★
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
