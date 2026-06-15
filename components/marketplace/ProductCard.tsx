'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Flame, Heart, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/marketplace/StarRating'
import { AddToCartButton } from '@/components/marketplace/AddToCartButton'
import { cn, formatPrice } from '@/lib/utils'
import {
  CATEGORY_ICONS,
  CATEGORY_STYLES,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_STYLE,
} from '@/lib/category-icons'
import type { ProductWithCategory } from '@/types'

type Props = {
  product: ProductWithCategory
  className?: string
}

export function ProductCard({ product, className }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const [isWishlisted, setWishlisted] = useState(false)

  const firstImage = product.images[0]
  const showImage = Boolean(firstImage) && !imgFailed
  const categorySlug = product.category?.slug ?? ''
  const categoryStyle = CATEGORY_STYLES[categorySlug] ?? DEFAULT_CATEGORY_STYLE
  const placeholderGradient = categoryStyle.productBg
  const PlaceholderIcon = CATEGORY_ICONS[categorySlug] ?? DEFAULT_CATEGORY_ICON

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-gray-100/80 bg-white',
        'shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300',
        'hover:-translate-y-1.5 hover:border-violet-200/60 hover:shadow-[0_16px_40px_rgba(109,40,217,0.12)]',
        className
      )}
    >
      {/* Image zone */}
      <div className="relative overflow-hidden">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden"
          tabIndex={-1}
        >
          {showImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center bg-gradient-to-br',
                placeholderGradient
              )}
            >
              <PlaceholderIcon className="h-12 w-12 text-current opacity-50 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.isBestseller && (
              <Badge className="flex items-center gap-1 rounded-lg border border-amber-300 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 shadow-[0_1px_4px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                <TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
                Bestseller
              </Badge>
            )}
            {product.isTrending && !product.isBestseller && (
              <Badge className="flex items-center gap-1 rounded-lg border border-violet-300 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 shadow-[0_1px_4px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                <Flame className="h-2.5 w-2.5" aria-hidden="true" />
                Trending
              </Badge>
            )}
          </div>
        </Link>

        {/* Slide-up add-to-cart — desktop hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:pointer-events-auto group-hover:translate-y-0">
          <div className="bg-gradient-to-t from-black/60 via-black/25 to-transparent px-3 pt-16 pb-3">
            <AddToCartButton
              product={product}
              className="h-11 w-full cursor-pointer rounded-full bg-white/95 text-sm font-semibold text-gray-900 shadow-[0_8px_28px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all hover:bg-white hover:shadow-[0_10px_32px_rgba(0,0,0,0.28)]"
            />
          </div>
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={() => setWishlisted((prev) => !prev)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={cn(
            'absolute top-2.5 right-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110',
            isWishlisted ? 'bg-rose-50 hover:bg-rose-100' : 'bg-white/90 hover:bg-white'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-all duration-200',
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        {/* Category with icon */}
        {product.category && (
          <div className="flex items-center gap-1">
            <PlaceholderIcon className="h-3 w-3 shrink-0 text-violet-500" aria-hidden="true" />
            <span className="truncate text-[10px] font-semibold tracking-widest text-violet-600 uppercase">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Product name */}
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 transition-colors hover:text-violet-600">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <StarRating
          rating={Number(product.rating)}
          reviewCount={product.reviewCount}
          size="sm"
          className="mt-0.5"
        />

        {/* Price + mobile cart */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-extrabold text-gray-900">{formatPrice(product.price)}</span>
          <AddToCartButton
            product={product}
            iconOnly
            className="h-9 min-h-11 w-9 min-w-11 cursor-pointer rounded-lg bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:scale-95 lg:hidden"
          />
        </div>
      </div>
    </div>
  )
}
