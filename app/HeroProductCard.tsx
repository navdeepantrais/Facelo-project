'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

export function HeroProductCard({ product }: { product: ProductWithCategory }) {
  const [imgFailed, setImgFailed] = useState(false)
  const firstImage = product.images[0]
  const showImage = Boolean(firstImage) && !imgFailed

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-50">
        {showImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100">
            <ShoppingBag className="h-12 w-12 text-violet-300" />
          </div>
        )}
      </div>

      <div className="px-3 pt-2.5 pb-3">
        <p className="truncate text-sm font-semibold text-gray-800">{product.name}</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-violet-600">{formatPrice(product.price)}</p>
          {product.category && (
            <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-semibold text-violet-600">
              {product.category.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
