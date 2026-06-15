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
  const currentBrand = searchParams.get('brand') ?? ''
  const currentCreator = searchParams.get('creator') ?? ''

  function clearAll() {
    removeParams('minPrice', 'maxPrice', 'rating', 'brand', 'creator')
  }

  const hasActiveFilters = !!(
    currentMinPrice ||
    currentMaxPrice ||
    currentRating ||
    currentBrand ||
    currentCreator
  )

  const Tag = bare ? 'div' : 'aside'
  const outerClass = bare
    ? cn('flex flex-col gap-6', className)
    : cn('rounded-xl border border-border bg-card p-6 shadow-sm', className)

  return (
    <Tag className={outerClass}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-primary text-xs font-medium hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <p className="text-foreground text-sm font-semibold">Price Range</p>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="minPrice" className="text-muted-foreground text-xs">
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
          <span className="text-muted-foreground mt-5 text-sm">–</span>
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="maxPrice" className="text-muted-foreground text-xs">
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
        <p className="text-foreground text-sm font-semibold">Rating</p>
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
                  isActive ? 'bg-foreground text-background' : 'hover:bg-muted text-foreground'
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

      <Separator />

      {/* Brand */}
      <div className="flex flex-col gap-3">
        <p className="text-foreground text-sm font-semibold">Brand</p>
        <div className="flex flex-col gap-1">
          <Label htmlFor="brand" className="sr-only">
            Brand name
          </Label>
          <Input
            id="brand"
            type="text"
            placeholder="e.g. Nike, Apple…"
            defaultValue={currentBrand}
            onBlur={(e) => setParam('brand', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setParam('brand', (e.target as HTMLInputElement).value)
            }}
            className="h-9 rounded-lg text-sm"
          />
          {currentBrand && (
            <button
              type="button"
              onClick={() => setParam('brand', '')}
              className="text-primary mt-1 self-start text-xs font-medium hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Creator */}
      <div className="flex flex-col gap-3">
        <p className="text-foreground text-sm font-semibold">Creator</p>
        <div className="flex flex-col gap-1">
          <Label htmlFor="creator" className="sr-only">
            Creator slug
          </Label>
          <Input
            id="creator"
            type="text"
            placeholder="e.g. valeria"
            defaultValue={currentCreator}
            onBlur={(e) => setParam('creator', e.target.value.toLowerCase().trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                setParam('creator', (e.target as HTMLInputElement).value.toLowerCase().trim())
            }}
            className="h-9 rounded-lg text-sm"
          />
          {currentCreator && (
            <button
              type="button"
              onClick={() => setParam('creator', '')}
              className="text-primary mt-1 self-start text-xs font-medium hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </Tag>
  )
}
