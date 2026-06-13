'use client'

import { Star, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useUrlParams } from '@/hooks/use-url-params'
import type { Category } from '@/types'

type Props = {
  categories: Category[]
}

type ActiveFilter = {
  key: string
  label: string
}

export function ActiveFilters({ categories }: Props) {
  const { searchParams, removeParams } = useUrlParams()

  const activeFilters: ActiveFilter[] = []

  const categorySlug = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const rating = searchParams.get('rating')
  const q = searchParams.get('q')

  if (q) {
    activeFilters.push({ key: 'q', label: `"${q}"` })
  }
  if (categorySlug) {
    const cat = categories.find((c) => c.slug === categorySlug)
    activeFilters.push({ key: 'category', label: cat?.name ?? categorySlug })
  }
  if (minPrice && maxPrice) {
    activeFilters.push({ key: 'price', label: `$${minPrice} – $${maxPrice}` })
  } else if (minPrice) {
    activeFilters.push({ key: 'price', label: `From $${minPrice}` })
  } else if (maxPrice) {
    activeFilters.push({ key: 'price', label: `Up to $${maxPrice}` })
  }
  if (rating) {
    activeFilters.push({ key: 'rating', label: `${rating}+` })
  }

  if (activeFilters.length === 0) return null

  function removeFilter(key: string) {
    if (key === 'price') {
      removeParams('minPrice', 'maxPrice')
    } else {
      removeParams(key)
    }
  }

  function clearAll() {
    removeParams('q', 'category', 'minPrice', 'maxPrice', 'rating')
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="text-sm text-muted-foreground">Filters:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1 pr-1.5 font-normal"
        >
          {filter.label}
          {filter.key === 'rating' && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
          )}
          <button
            onClick={() => removeFilter(filter.key)}
            aria-label={`Remove ${filter.key === 'rating' ? `${filter.label} star rating` : filter.label} filter`}
            className="ml-0.5 rounded-full hover:text-foreground text-muted-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={clearAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
