'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { useUrlParams } from '@/hooks/use-url-params'

export function FilterDrawer() {
  const { searchParams } = useUrlParams()

  const priceActive = !!(searchParams.get('minPrice') || searchParams.get('maxPrice'))
  const ratingActive = !!searchParams.get('rating')
  const brandActive = !!searchParams.get('brand')
  const creatorActive = !!searchParams.get('creator')
  const activeCount =
    (priceActive ? 1 : 0) + (ratingActive ? 1 : 0) + (brandActive ? 1 : 0) + (creatorActive ? 1 : 0)

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="border-border relative h-9 gap-2 rounded-xl px-4"
          />
        }
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium">Filters</span>
        {activeCount > 0 && (
          <span
            aria-label={`${activeCount} active filter${activeCount > 1 ? 's' : ''}`}
            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] leading-none font-bold text-white"
          >
            {activeCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="gap-0 p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <FilterSidebar bare />
        </div>
      </SheetContent>
    </Sheet>
  )
}
