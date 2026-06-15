import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, getRelatedProducts } from '@/lib/actions/products'
import { ProductImageGallery } from '@/components/marketplace/ProductImageGallery'
import { AddToCartButton } from '@/components/marketplace/AddToCartButton'
import { StarRating } from '@/components/marketplace/StarRating'
import { MarketplaceSection } from '@/components/marketplace/MarketplaceSection'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.categoryId)

  const isOutOfStock = product.stock <= 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div className="flex flex-col gap-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.isBestseller && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-500">Bestseller</Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-foreground text-background hover:bg-foreground">Trending</Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary">Editor&apos;s Pick</Badge>
            )}
            {isOutOfStock && <Badge variant="destructive">Out of stock</Badge>}
          </div>

          {product.category && (
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </p>
          )}

          <h1 className="text-2xl font-bold leading-tight lg:text-3xl">{product.name}</h1>

          {product.brand && (
            <p className="text-sm text-muted-foreground">by {product.brand}</p>
          )}

          <StarRating
            rating={Number(product.rating)}
            reviewCount={product.reviewCount}
            size="md"
          />

          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          <Separator />

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Stock indicator */}
          {!isOutOfStock && product.stock <= 10 && (
            <p className="text-sm font-medium text-amber-600">
              Only {product.stock} left in stock
            </p>
          )}

          <AddToCartButton
            product={product}
            size="lg"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <MarketplaceSection
            title="You may also like"
            products={related}
          />
        </div>
      )}
    </div>
  )
}
