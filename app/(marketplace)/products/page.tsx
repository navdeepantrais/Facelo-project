import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/actions/products'
import { parseProductFilters } from '@/lib/queries/products'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { ActiveFilters } from '@/components/marketplace/ActiveFilters'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { SortSelect } from '@/components/marketplace/SortSelect'
import { Paginator } from '@/components/marketplace/Paginator'
import { CategoryTabs } from './CategoryTabs'
import { ProductListRow } from './ProductListRow'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse all products on Facelo.',
}

type PageProps = {
  searchParams: Promise<Record<string, string>>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = parseProductFilters(params)

  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ])

  function buildHref(p: number) {
    const sp = new URLSearchParams(params)
    sp.set('page', String(p))
    return `/products?${sp.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">

        {/* Top bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Featured Products</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {total.toLocaleString()} result{total !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Suspense>
              <SearchBar placeholder="Search products…" className="w-full sm:w-64" />
            </Suspense>
            <Suspense>
              <SortSelect className="w-44" />
            </Suspense>
          </div>
        </div>

        {/* Category tabs — full width above both columns */}
        <Suspense>
          <CategoryTabs categories={categories} />
        </Suspense>

        {/* Active filter chips */}
        <Suspense>
          <ActiveFilters categories={categories} />
        </Suspense>

        {/* Main layout: sidebar + product list */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <aside className="w-full shrink-0 md:w-[260px]">
            <Suspense>
              <FilterSidebar />
            </Suspense>
          </aside>

          <div className="flex flex-1 flex-col gap-4 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center shadow-sm">
                <p className="text-lg font-medium text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <ProductListRow key={product.id} product={product} />
              ))
            )}

            <Suspense>
              <Paginator page={page} totalPages={totalPages} buildHref={buildHref} />
            </Suspense>
          </div>
        </div>

      </div>
    </div>
  )
}
