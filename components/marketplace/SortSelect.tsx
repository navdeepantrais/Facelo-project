'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUrlParams } from '@/hooks/use-url-params'
import type { SortOption } from '@/types'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popularity', label: 'Most Popular' },
]

type Props = {
  className?: string
}

export function SortSelect({ className }: Props) {
  const { searchParams, setParam } = useUrlParams()
  const currentSort = (searchParams.get('sort') as SortOption) ?? 'newest'

  function handleChange(value: string | null) {
    if (!value) return
    setParam('sort', value)
  }

  return (
    <Select value={currentSort} onValueChange={handleChange}>
      <SelectTrigger className={className} aria-label="Sort products">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
