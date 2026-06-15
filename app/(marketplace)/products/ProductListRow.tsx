'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/marketplace/StarRating'
import { AddToCartButton } from '@/components/marketplace/AddToCartButton'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

type Props = {
  product: ProductWithCategory
  className?: string
}

export function ProductListRow({ product, className }: Props) {
  const firstImage = product.images[0]

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative size-[120px] shrink-0 overflow-hidden rounded-lg bg-muted"
        tabIndex={-1}
      >
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Badge */}
        <div className="absolute left-1.5 top-1.5">
          {product.isBestseller && (
            <Badge className="rounded-full bg-amber-500 px-1.5 py-0 text-[10px] text-white hover:bg-amber-500">
              Bestseller
            </Badge>
          )}
          {product.isTrending && !product.isBestseller && (
            <Badge className="rounded-full bg-primary px-1.5 py-0 text-[10px] text-primary-foreground hover:bg-primary">
              Trending
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="truncate text-lg font-bold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <StarRating
          rating={Number(product.rating)}
          reviewCount={product.reviewCount}
          size="sm"
        />
        <div className="text-xl font-bold text-foreground">
          {formatPrice(product.price)}
        </div>
      </div>

      {/* CTA */}
      <AddToCartButton product={product} className="shrink-0 rounded-full" />
    </div>
  )
}
