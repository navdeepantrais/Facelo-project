'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
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
        'group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-lg',
        className
      )}
    >
      {/* Image wrapper — heart button sits outside Link to avoid navigation on click */}
      <div className="relative">
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
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <span className="text-xs">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
            {product.isBestseller && (
              <Badge className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] text-white shadow-sm hover:bg-amber-500">
                Bestseller
              </Badge>
            )}
            {product.isTrending && !product.isBestseller && (
              <Badge className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground shadow-sm hover:bg-primary">
                Trending
              </Badge>
            )}
          </div>
        </Link>

        {/* Wishlist — outside Link so click doesn't navigate */}
        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
        >
          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.category && (
          <span className="truncate text-[10px] font-semibold uppercase tracking-widest text-primary">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <StarRating
          rating={Number(product.rating)}
          reviewCount={product.reviewCount}
          size="sm"
        />

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <span className="text-base font-bold text-foreground">
            ${Number(product.price).toFixed(2)}
          </span>
          <AddToCartButton product={product} iconOnly />
        </div>
      </div>
    </div>
  )
}
