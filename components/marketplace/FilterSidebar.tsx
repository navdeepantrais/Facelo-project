'use client'

import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUrlParams } from '@/hooks/use-url-params'

type Props = {
  bare?: boolean
  className?: string
}

const RATING_OPTIONS = [5, 4, 3] as const

export function FilterSidebar({ bare = false, className }: Props) {
  const { searchParams, setParam, removeParams } = useUrlParams()

  const currentMinPrice = searchParams.get('minPrice') ?? ''
  const currentMaxPrice = searchParams.get('maxPrice') ?? ''
  const currentRating = searchParams.get('rating') ?? ''

  function clearAll() {
    removeParams('minPrice', 'maxPrice', 'rating')
  }

  const hasActiveFilters = !!(currentMinPrice || currentMaxPrice || currentRating)

  const Tag = bare ? 'div' : 'aside'
  const outerClass = bare
    ? cn('flex flex-col gap-6', className)
    : cn('rounded-xl border border-border bg-card p-6 shadow-sm', className)

  return (
    <Tag className={outerClass}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Price Range</p>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
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
              className="h-9 rounded-lg text-sm"
            />
          </div>
          <span className="mt-5 text-sm text-muted-foreground">–</span>
          <div className="flex flex-1 flex-col gap-1">
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
              className="h-9 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Rating</p>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((r) => {
            const isActive = currentRating === String(r)
            return (
              <button
                key={r}
                type="button"
                onClick={() => setParam('rating', isActive ? '' : String(r))}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < r
                          ? isActive
                            ? 'fill-background text-background'
                            : 'fill-amber-400 text-amber-400'
                          : isActive
                            ? 'fill-background/30 text-background/30'
                            : 'fill-muted-foreground/30 text-muted-foreground/30'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium">{r}+ stars</span>
              </button>
            )
          })}
        </div>
      </div>
    </Tag>
  )
}
