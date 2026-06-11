import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProducts, getCategories } from '@/lib/actions/products'
import { parseProductFilters } from '@/lib/queries/products'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SortSelect } from '@/components/marketplace/SortSelect'
import { Paginator } from '@/components/marketplace/Paginator'
import { Suspense } from 'react'

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

export default async function CategoryProductsPage({ params, searchParams }: PageProps) {
  const [{ slug }, rawParams, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const filters = parseProductFilters({ ...rawParams, category: slug })
  const { products, total, page, totalPages } = await getProducts(filters)

  function buildHref(p: number) {
    const sp = new URLSearchParams(rawParams)
    sp.set('page', String(p))
    return `/categories/${slug}?${sp.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'product' : 'products'}
          </p>
        </div>
        <Suspense>
          <SortSelect className="w-44" />
        </Suspense>
      </div>

      <ProductGrid products={products} />

      <div className="mt-8">
        <Suspense>
          <Paginator page={page} totalPages={totalPages} buildHref={buildHref} />
        </Suspense>
      </div>
    </div>
  )
}
