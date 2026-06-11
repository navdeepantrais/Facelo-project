'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/marketplace/StarRating'
import { AddToCartButton } from '@/components/marketplace/AddToCartButton'
import { cn } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

type Props = {
  product: ProductWithCategory
  className?: string
}

export function ProductCard({ product, className }: Props) {
  const firstImage = product.images[0]

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
        tabIndex={-1}
      >
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isBestseller && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-500">Bestseller</Badge>
          )}
          {product.isTrending && !product.isBestseller && (
            <Badge className="bg-violet-600 text-white hover:bg-violet-600">Trending</Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {product.category && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
        )}

        <StarRating
          rating={Number(product.rating)}
          reviewCount={product.reviewCount}
          size="sm"
        />

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-semibold">
            ${Number(product.price).toFixed(2)}
          </span>
          <AddToCartButton
            product={product}
            size="sm"
            variant="outline"
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  )
}
