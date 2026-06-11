import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/actions/products'
import { parseProductFilters } from '@/lib/queries/products'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { ActiveFilters } from '@/components/marketplace/ActiveFilters'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { SortSelect } from '@/components/marketplace/SortSelect'
import { Paginator } from '@/components/marketplace/Paginator'
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
        {/* Sidebar — hidden on mobile, shown via mobile sheet in FilterSidebar */}
        <aside className="w-full md:w-56 lg:w-64 shrink-0">
          <Suspense>
            <FilterSidebar categories={categories} />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Suspense>
              <SearchBar placeholder="Search products…" />
            </Suspense>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground shrink-0">
                {total} {total === 1 ? 'product' : 'products'}
              </span>
              <Suspense>
                <SortSelect className="w-44" />
              </Suspense>
            </div>
          </div>

          {/* Active filters */}
          <Suspense>
            <ActiveFilters categories={categories} />
          </Suspense>

          {/* Product grid */}
          <ProductGrid products={products} />

          {/* Pagination */}
          <Suspense>
            <Paginator page={page} totalPages={totalPages} buildHref={buildHref} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
