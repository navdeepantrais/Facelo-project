import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import {
  getFeaturedProducts,
  getNewArrivalProducts,
  getBestsellerProducts,
  getTrendingProducts,
  getCategories,
} from '@/lib/actions/marketplace'
import MarketplaceLayout from '@/components/layout/MarketplaceLayout'
import { MarketplaceSection } from '@/components/marketplace/MarketplaceSection'
import { Button } from '@/components/ui/button'
import { HeroProductCard } from '@/app/HeroProductCard'

const CATEGORY_ICONS: Record<string, string> = {
  accessories: '👜',
  'baby-kids': '🧸',
  'beauty-skincare': '✨',
  'electronics-tech': '💻',
  'fashion-apparel': '👗',
  'fitness-sports': '🏋️',
  'food-nutrition': '🥗',
  'health-wellness': '💊',
  'home-living': '🏠',
  'books-education': '📚',
  'pets': '🐾',
  'travel': '✈️',
}

export default async function HomePage() {
  const [user, trending, bestsellers, newArrivals, featured, allCategories] = await Promise.all([
    getCurrentUser(),
    getTrendingProducts(8),
    getBestsellerProducts(8),
    getNewArrivalProducts(8),
    getFeaturedProducts(8),
    getCategories(),
  ])

  const heroProducts = featured.slice(0, 4)

  return (
    <MarketplaceLayout profile={user}>
      {/* Hero — split layout */}
      <section className="relative overflow-hidden border-b bg-[#f8f7ff]">
        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[20%] h-[500px] w-[500px] rounded-full bg-violet-200/50 blur-[110px]" />
          <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-indigo-200/35 blur-[90px]" />
          <div className="absolute left-[5%] top-[40%] h-56 w-56 rounded-full bg-purple-200/30 blur-[80px]" />
        </div>

        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Left — text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                <span className="text-xs font-medium text-violet-700">Creator-curated marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Shop products{' '}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  creators love
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-500 lg:mx-0 lg:text-[1.05rem]">
                Discover curated products recommended by the creators you already follow.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  render={<Link href="/products" />}
                  className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-7 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.25)] transition-all hover:from-violet-800 hover:to-indigo-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.35)]"
                >
                  Browse products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/categories" />}
                  className="h-11 cursor-pointer rounded-xl border-gray-300 bg-white px-7 text-sm font-medium text-gray-700 hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700"
                >
                  Shop by category
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center justify-center divide-x divide-gray-200 lg:justify-start">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '5K+', label: 'Creators' },
                  { value: '$2M+', label: 'Revenue' },
                ].map(({ value, label }, i) => (
                  <div key={label} className={i === 0 ? 'pr-6 text-center lg:text-left' : 'px-6 text-center lg:text-left'}>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — staggered product grid, desktop only */}
            {heroProducts.length >= 2 && (
              <div className="hidden lg:block lg:w-[400px] lg:shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  {/* Column 1 — offset down */}
                  <div className="mt-8 flex flex-col gap-3">
                    {heroProducts.filter((_, i) => i % 2 === 0).map((p) => (
                      <HeroProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  {/* Column 2 — normal */}
                  <div className="flex flex-col gap-3">
                    {heroProducts.filter((_, i) => i % 2 === 1).map((p) => (
                      <HeroProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category strip */}
      {allCategories.length > 0 && (
        <div className="border-b bg-white">
          <div className="container mx-auto px-4">
            <div className="scrollbar-none flex gap-2 overflow-x-auto py-3">
              <Link
                href="/products"
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100"
              >
                🛍️ All products
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {CATEGORY_ICONS[cat.slug] ?? '📦'} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Marketplace sections */}
      <div className="container mx-auto space-y-14 px-4 py-12">
        {trending.length > 0 && (
          <MarketplaceSection
            title="Trending Now"
            seeAllHref="/products?sort=rating"
            products={trending}
          />
        )}

        {featured.length > 0 && (
          <MarketplaceSection
            title="Editor's Picks"
            seeAllHref="/products"
            products={featured}
          />
        )}

        {bestsellers.length > 0 && (
          <MarketplaceSection
            title="Bestsellers"
            seeAllHref="/products?sort=popularity"
            products={bestsellers}
          />
        )}

        {newArrivals.length > 0 && (
          <MarketplaceSection
            title="New Arrivals"
            seeAllHref="/products?sort=newest"
            products={newArrivals}
          />
        )}
      </div>
    </MarketplaceLayout>
  )
}
