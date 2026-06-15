import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ChevronRight } from 'lucide-react'
import { getProducts, getCategories } from '@/lib/actions/products'
import { parseProductFilters } from '@/lib/queries/products'
import { FilterDrawer } from '@/components/marketplace/FilterDrawer'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { SortSelect } from '@/components/marketplace/SortSelect'
import { Paginator } from '@/components/marketplace/Paginator'
import { ActiveFilters } from '@/components/marketplace/ActiveFilters'
import { CategoryTabs } from '@/app/(marketplace)/marketplace/CategoryTabs'
import { CategoryBanner } from './CategoryBanner'
import { EmptyProductsState } from '@/components/marketplace/EmptyProductsState'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return { title: 'Category not found' }
  return {
    title: cat.name,
    description: `Browse ${cat.name} products on Facelo.`,
  }
}

export default async function MarketplaceCategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, rawParams, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const filters = parseProductFilters({ ...rawParams, category: slug })
  const { products, total, page, totalPages } = await getProducts(filters)

  const hasActiveFilters = !!(
    rawParams.q ||
    rawParams.minPrice ||
    rawParams.maxPrice ||
    rawParams.rating
  )

  function buildHref(p: number) {
    const sp = new URLSearchParams(rawParams)
    sp.set('page', String(p))
    return `/marketplace/${slug}?${sp.toString()}`
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
        <div className="flex min-w-0 flex-1 flex-col gap-5 py-8 pb-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-foreground font-medium">{category.name}</li>
            </ol>
          </nav>

          {/* Category banner */}
          <CategoryBanner name={category.name} slug={slug} productCount={total} />

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

          {/* Active filter chips (price/rating only — category is the page itself) */}
          <Suspense>
            <ActiveFilters categories={[]} />
          </Suspense>

          {/* Product grid */}
          {products.length === 0 ? (
            hasActiveFilters ? (
              <EmptyProductsState
                title="No products match your filters"
                subtitle="Try adjusting your search or clearing some filters."
              />
            ) : (
              <EmptyProductsState
                title="No products yet"
                subtitle="This category is empty — check back soon or browse other categories."
              />
            )
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
