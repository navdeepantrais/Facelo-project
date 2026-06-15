import Link from 'next/link'
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
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
import HeroHeadline from '@/app/HeroHeadline'
import CategoryCarousel from '@/app/CategoryCarousel'

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
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-[#f0ebff] via-violet-50/50 to-white">
        {/* Single soft ambient glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[40%] top-0 h-[560px] w-[560px] -translate-y-1/4 rounded-full bg-violet-300/20 blur-[130px]" />
        </div>

        <div className="container relative mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Left — text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                  New: Global Creator Marketplace
                </span>
              </div>

              {/* Headline */}
              <HeroHeadline />

              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-500 lg:mx-0">
                Real people. Real recommendations. Every product is handpicked by a creator you trust. Join the community redefined by authenticity.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  render={<Link href="/marketplace" />}
                  className="h-12 cursor-pointer gap-2 rounded-xl bg-violet-700 px-7 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.30)] transition-all hover:bg-violet-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.40)]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Browse marketplace
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/creator/apply" />}
                  className="h-12 cursor-pointer rounded-xl border-violet-300 bg-white px-7 text-sm font-semibold text-violet-700 transition-all hover:border-violet-500 hover:bg-violet-50"
                >
                  Become a creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-8 flex w-fit items-center gap-8 rounded-2xl border border-gray-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm max-lg:mx-auto">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '5K+',  label: 'Creators' },
                  { value: '$2M+', label: 'Revenue'  },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <div className="text-xl font-black text-gray-900">{value}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — scattered floating product cards, desktop only */}
            {heroProducts.length >= 2 && (
              <div className="relative hidden py-8 lg:block lg:w-[460px] lg:shrink-0">
                {/* Ambient glow */}
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/15 blur-[80px]" />

                <div className="relative h-[500px]">

                  {/* Card 1 — top-left, tilted counter-clockwise, floats slowly */}
                  <div className="group absolute left-0 top-8 z-10 w-[215px] -rotate-[5deg] transition-all duration-300 hover:z-30 hover:rotate-0 hover:-translate-y-3 hover:scale-[1.03]">
                    <div className="animate-[hero-float_4s_ease-in-out_infinite]">
                      <HeroProductCard product={heroProducts[0]} />
                    </div>
                  </div>

                  {/* Card 2 — top-right, tilted clockwise */}
                  <div className="group absolute right-0 top-0 z-20 w-[200px] rotate-[4deg] transition-all duration-300 hover:z-30 hover:rotate-0 hover:-translate-y-3 hover:scale-[1.03]">
                    <HeroProductCard product={heroProducts[1]} />
                  </div>

                  {/* Card 3 — bottom-left, tilted clockwise */}
                  {heroProducts[2] && (
                    <div className="group absolute bottom-0 left-4 z-10 w-[200px] rotate-[3deg] transition-all duration-300 hover:z-30 hover:rotate-0 hover:-translate-y-3 hover:scale-[1.03]">
                      <HeroProductCard product={heroProducts[2]} />
                    </div>
                  )}

                  {/* Card 4 — bottom-right, tilted counter-clockwise, floats with delay */}
                  {heroProducts[3] && (
                    <div className="group absolute bottom-4 right-2 z-20 w-[195px] -rotate-[4deg] transition-all duration-300 hover:z-30 hover:rotate-0 hover:-translate-y-3 hover:scale-[1.03]">
                      <div className="animate-[hero-float_4s_ease-in-out_1.5s_infinite] group-hover:[animation-play-state:paused]">
                        <HeroProductCard product={heroProducts[3]} />
                      </div>
                    </div>
                  )}

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
            <CategoryCarousel categories={allCategories} />
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
