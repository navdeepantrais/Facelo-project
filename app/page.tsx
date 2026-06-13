import Link from 'next/link'
import { ArrowRight, Flame, Sparkles, Star } from 'lucide-react'
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
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/category-icons'
import { cn } from '@/lib/utils'

const CATEGORY_CARD_STYLES: Record<string, { bg: string; icon: string; text: string }> = {
  accessories:        { bg: 'from-violet-100 to-indigo-100',  icon: 'text-violet-600',  text: 'text-violet-700'  },
  'baby-kids':        { bg: 'from-sky-100 to-cyan-100',       icon: 'text-sky-600',     text: 'text-sky-700'     },
  'beauty-skincare':  { bg: 'from-rose-100 to-pink-100',      icon: 'text-rose-600',    text: 'text-rose-700'    },
  'electronics-tech': { bg: 'from-blue-100 to-indigo-100',    icon: 'text-blue-600',    text: 'text-blue-700'    },
  'fashion-apparel':  { bg: 'from-fuchsia-100 to-purple-100', icon: 'text-fuchsia-600', text: 'text-fuchsia-700' },
  'fitness-sports':   { bg: 'from-emerald-100 to-teal-100',   icon: 'text-emerald-600', text: 'text-emerald-700' },
  'food-nutrition':   { bg: 'from-amber-100 to-orange-100',   icon: 'text-amber-600',   text: 'text-amber-700'   },
  'health-wellness':  { bg: 'from-cyan-100 to-teal-100',      icon: 'text-cyan-600',    text: 'text-cyan-700'    },
  'home-living':      { bg: 'from-yellow-100 to-amber-100',   icon: 'text-yellow-700',  text: 'text-yellow-800'  },
  'books-education':  { bg: 'from-orange-100 to-amber-100',   icon: 'text-orange-600',  text: 'text-orange-700'  },
  pets:               { bg: 'from-green-100 to-emerald-100',  icon: 'text-green-600',   text: 'text-green-700'   },
  travel:             { bg: 'from-indigo-100 to-blue-100',    icon: 'text-indigo-600',  text: 'text-indigo-700'  },
}
const DEFAULT_CARD_STYLE = { bg: 'from-gray-100 to-slate-100', icon: 'text-gray-500', text: 'text-gray-700' }

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
    <MarketplaceLayout profile={user} showFooter>
      {/* Hero — split layout */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-violet-100 via-[#ede9fe] to-indigo-100">
        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[20%] h-[500px] w-[500px] rounded-full bg-violet-300/55 blur-[110px]" />
          <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-indigo-300/45 blur-[90px]" />
          <div className="absolute left-[5%] top-[40%] h-56 w-56 rounded-full bg-purple-300/40 blur-[80px]" />
        </div>

        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Left — text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/60 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
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

              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-600 lg:mx-0 lg:text-[1.05rem]">
                Discover curated products recommended by the creators you already follow.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  render={<Link href="/marketplace" />}
                  className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 px-7 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.25)] transition-all hover:from-violet-800 hover:to-indigo-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.35)]"
                >
                  Browse products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/marketplace" />}
                  className="h-11 cursor-pointer rounded-xl border-violet-400/70 bg-white/80 px-7 text-sm font-semibold text-violet-700 backdrop-blur-sm transition-all hover:border-violet-500 hover:bg-white hover:text-violet-800"
                >
                  Shop by category
                </Button>
              </div>

              {/* Become a Creator CTA */}
              <div className="mt-3 flex items-center justify-center lg:justify-start">
                <Button
                  size="sm"
                  render={<Link href="/creator/apply" />}
                  className="h-9 cursor-pointer gap-1.5 rounded-xl border border-violet-200/60 bg-white/60 px-4 text-sm font-medium text-violet-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-white/90 hover:text-violet-800"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Become a Creator
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center justify-center divide-x divide-gray-300/70 lg:justify-start">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '5K+', label: 'Creators' },
                  { value: '$2M+', label: 'Revenue' },
                ].map(({ value, label }, i) => (
                  <div key={label} className={i === 0 ? 'pr-6 text-center lg:text-left' : 'px-6 text-center lg:text-left'}>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="mt-0.5 text-xs text-gray-600">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — staggered product grid, desktop only */}
            {heroProducts.length >= 2 && (
              <div className="relative hidden py-5 lg:block lg:w-[420px] lg:shrink-0">
                {/* Backdrop glows */}
                <div aria-hidden="true" className="pointer-events-none absolute -inset-8 -z-10">
                  <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/40 blur-[80px]" />
                  <div className="absolute bottom-[10%] left-[15%] h-52 w-52 rounded-full bg-indigo-200/30 blur-[60px]" />
                </div>

                {/* Badge — top center */}
                <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3.5 py-1.5 shadow-lg shadow-violet-100/40 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-semibold text-gray-700">Just In</span>
                </div>

                {/* Badge — bottom right */}
                <div className="absolute bottom-0 right-6 z-10 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3.5 py-1.5 shadow-lg shadow-violet-100/40 backdrop-blur-sm">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-[10px] font-semibold text-gray-700">Trending</span>
                </div>

                {/* Badge — bottom left */}
                <div className="absolute bottom-0 left-4 z-10 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3.5 py-1.5 shadow-lg shadow-violet-100/40 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-semibold text-gray-700">Top Rated</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="mt-10 flex flex-col gap-3">
                    {heroProducts.filter((_, i) => i % 2 === 0).map((p) => (
                      <HeroProductCard key={p.id} product={p} />
                    ))}
                  </div>
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

      {/* Marketplace sections */}
      <div className="container mx-auto space-y-14 px-4 py-12">

        {/* Shop by Category */}
        {allCategories.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Shop by Category
                </h2>
                <p className="mt-1 text-sm text-gray-500">Browse products across all creator-curated categories</p>
              </div>
              <Link
                href="/marketplace"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {allCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.slug] ?? DEFAULT_CATEGORY_ICON
                const style = CATEGORY_CARD_STYLES[cat.slug] ?? DEFAULT_CARD_STYLE
                return (
                  <Link
                    key={cat.id}
                    href={`/marketplace/${cat.slug}`}
                    className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                        style.bg
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6 transition-transform duration-200 group-hover:scale-110',
                          style.icon
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <span className={cn('text-xs font-semibold leading-tight', style.text)}>
                      {cat.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {trending.length > 0 && (
          <MarketplaceSection
            title="Trending Now"
            seeAllHref="/marketplace?sort=rating"
            products={trending}
          />
        )}

        {featured.length > 0 && (
          <MarketplaceSection
            title="Editor's Picks"
            seeAllHref="/marketplace"
            products={featured}
          />
        )}

        {bestsellers.length > 0 && (
          <MarketplaceSection
            title="Bestsellers"
            seeAllHref="/marketplace?sort=popularity"
            products={bestsellers}
          />
        )}

        {newArrivals.length > 0 && (
          <MarketplaceSection
            title="New Arrivals"
            seeAllHref="/marketplace?sort=newest"
            products={newArrivals}
          />
        )}
      </div>
    </MarketplaceLayout>
  )
}
