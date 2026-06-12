import { getCurrentUser } from '@/lib/auth'
import {
  getFeaturedProducts,
  getNewArrivalProducts,
  getBestsellerProducts,
  getTrendingProducts,
} from '@/lib/actions/marketplace'
import MarketplaceLayout from '@/components/layout/MarketplaceLayout'
import { MarketplaceSection } from '@/components/marketplace/MarketplaceSection'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const [user, trending, bestsellers, newArrivals, featured] = await Promise.all([
    getCurrentUser(),
    getTrendingProducts(8),
    getBestsellerProducts(8),
    getNewArrivalProducts(8),
    getFeaturedProducts(8),
  ])

  return (
    <MarketplaceLayout profile={user}>
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-muted/60 to-background dark:from-muted/30 dark:to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Shop products <span className="text-primary">creators love</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover curated products recommended by the creators you already follow.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" render={<Link href="/products" />}>
                Browse products
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/categories" />}>
                Shop by category
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace sections */}
      <div className="container mx-auto px-4 py-12 space-y-14">
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
