'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

export function HeroProductCard({ product }: { product: ProductWithCategory }) {
  const [imgFailed, setImgFailed] = useState(false)
  const firstImage = product.images[0]
  const showImage = Boolean(firstImage) && !imgFailed

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        {showImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full flex-col items-center justify-center gap-2',
              'bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-100'
            )}
          >
            <span className="text-4xl opacity-70 transition-transform duration-300 group-hover:scale-110">
              🛍️
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-medium text-gray-800">{product.name}</p>
        <p className="mt-0.5 text-xs font-semibold text-violet-600">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
