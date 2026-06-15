import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/actions/products'
import { parseProductFilters } from '@/lib/queries/products'
import { ActiveFilters } from '@/components/marketplace/ActiveFilters'
import { FilterDrawer } from '@/components/marketplace/FilterDrawer'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { SortSelect } from '@/components/marketplace/SortSelect'
import { Paginator } from '@/components/marketplace/Paginator'
import { CategoryTabs } from './CategoryTabs'
import { EmptyProductsState } from '@/components/marketplace/EmptyProductsState'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browse all products on Facelo.',
}

type PageProps = {
  searchParams: Promise<Record<string, string>>
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = parseProductFilters(params)

  const [{ products, page, totalPages }, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ])

  function buildHref(p: number) {
    const sp = new URLSearchParams(params)
    sp.set('page', String(p))
    return `/marketplace?${sp.toString()}`
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-0 md:gap-8">

        {/* Left — sticky category sidebar, desktop only */}
        <aside className="hidden md:block md:w-52 md:shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8">
            <Suspense>
              <CategoryTabs categories={categories} layout="vertical" />
            </Suspense>
          </div>
        </aside>

        {/* Right — normal page flow */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 py-8 pb-16">

          {/* Category tabs — mobile only */}
          <div className="md:hidden">
            <Suspense>
              <CategoryTabs categories={categories} layout="horizontal" />
            </Suspense>
          </div>

          {/* Toolbar: search · sort · filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Suspense>
              <SearchBar placeholder="Search products…" className="sm:flex-1" />
            </Suspense>
            <div className="flex shrink-0 items-center gap-2">
              <Suspense>
                <SortSelect className="w-[160px]" />
              </Suspense>
              <Suspense>
                <FilterDrawer />
              </Suspense>
            </div>
          </div>

          {/* Active filter chips */}
          <Suspense>
            <ActiveFilters categories={categories} />
          </Suspense>

          {/* Product grid */}
          {products.length === 0 ? (
            <EmptyProductsState
              title="No products found"
              subtitle="Try adjusting your filters or search query."
            />
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination */}
          <Suspense>
            <Paginator page={page} totalPages={totalPages} buildHref={buildHref} />
          </Suspense>

        </div>
      </div>
    </div>
  )
}
