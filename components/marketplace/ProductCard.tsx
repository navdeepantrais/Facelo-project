'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/marketplace/StarRating'
import { AddToCartButton } from '@/components/marketplace/AddToCartButton'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  'beauty-skincare': 'from-pink-50 via-rose-50 to-pink-100',
  'electronics-tech': 'from-blue-50 via-sky-50 to-indigo-100',
  'fashion-apparel': 'from-purple-50 via-fuchsia-50 to-purple-100',
  'fitness-sports': 'from-green-50 via-emerald-50 to-teal-100',
  'food-nutrition': 'from-orange-50 via-amber-50 to-yellow-100',
  'health-wellness': 'from-teal-50 via-cyan-50 to-teal-100',
  'home-living': 'from-yellow-50 via-amber-50 to-orange-100',
  accessories: 'from-indigo-50 via-violet-50 to-indigo-100',
}

const CATEGORY_ICONS: Record<string, string> = {
  'beauty-skincare': '✨',
  'electronics-tech': '💻',
  'fashion-apparel': '👗',
  'fitness-sports': '🏋️',
  'food-nutrition': '🥗',
  'health-wellness': '💊',
  'home-living': '🏠',
  accessories: '👜',
}

type Props = {
  product: ProductWithCategory
  className?: string
}

export function ProductCard({ product, className }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const firstImage = product.images[0]
  const showImage = Boolean(firstImage) && !imgFailed
  const categorySlug = product.category?.slug ?? ''
  const placeholderGradient =
    CATEGORY_COLORS[categorySlug] ?? 'from-violet-50 via-indigo-50 to-purple-100'
  const placeholderIcon = CATEGORY_ICONS[categorySlug] ?? '🛍️'

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-violet-200/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]',
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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className={cn(
                'flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br',
                placeholderGradient
              )}
            >
              <span className="text-5xl opacity-70 transition-transform duration-300 group-hover:scale-110">
                {placeholderIcon}
              </span>
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
              <Badge className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] text-white shadow-sm hover:bg-violet-600">
                Trending
              </Badge>
            )}
          </div>
        </Link>

        {/* Hover overlay — desktop add-to-cart CTA slides up */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:pointer-events-auto group-hover:translate-y-0">
          <div className="bg-gradient-to-t from-black/65 via-black/35 to-transparent px-3 pb-3 pt-10">
            <AddToCartButton
              product={product}
              className="h-9 w-full cursor-pointer rounded-xl bg-white/95 text-xs font-semibold text-gray-900 shadow-sm hover:bg-white"
            />
          </div>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
        >
          <Heart className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        {product.category && (
          <span className="truncate text-[9px] font-semibold uppercase tracking-widest text-violet-600">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-1 text-xs font-semibold leading-snug text-gray-900 transition-colors hover:text-violet-600">
            {product.name}
          </h3>
        </Link>

        <StarRating
          rating={Number(product.rating)}
          reviewCount={product.reviewCount}
          size="sm"
          className="mt-0.5"
        />

        {/* Price + mobile cart button */}
        <div className="mt-auto flex items-center justify-between gap-1.5 pt-1.5">
          <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
          {/* Icon button — visible on mobile/tablet; desktop uses hover overlay */}
          <AddToCartButton
            product={product}
            iconOnly
            className="h-7 w-7 cursor-pointer rounded-lg bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:scale-95 lg:hidden"
          />
        </div>
      </div>
    </div>
  )
}
