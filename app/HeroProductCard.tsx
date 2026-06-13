'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductWithCategory } from '@/types'

export function HeroProductCard({ product }: { product: ProductWithCategory }) {
  const [imgFailed, setImgFailed] = useState(false)
  const firstImage = product.images[0]
  const showImage = Boolean(firstImage) && !imgFailed

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-violet-200/60 hover:shadow-[0_14px_32px_rgba(109,40,217,0.15)]"
    >
      <div className="relative aspect-square overflow-hidden">
        {showImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={cn(
              'flex h-full w-full flex-col items-center justify-center gap-2',
              'bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-100'
            )}
          >
            <ShoppingBag className="h-14 w-14 text-violet-300 opacity-70 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}

        {/* Bottom image gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category chip */}
        {product.category && (
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm backdrop-blur-sm">
            {product.category.name}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        <p className="truncate text-xs font-medium text-gray-800">{product.name}</p>
        <p className="mt-0.5 text-xs font-bold text-violet-600">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
