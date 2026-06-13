'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import type { CartItem } from '@/hooks/use-cart'

type Props = {
  item: CartItem
}

export function CartItemRow({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item
  const firstImage = product.images[0]
  const unitPrice = Number(product.price)
  const lineTotal = (unitPrice * quantity).toFixed(2)

  return (
    <div className="flex gap-4 py-4">
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
            {product.name}
          </p>
          <button
            onClick={() => removeFromCart(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Unit price */}
        <p className="text-xs text-muted-foreground">${unitPrice.toFixed(2)} each</p>

        {/* Qty controls + line total */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-0.5 rounded-lg border bg-white p-0.5">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label="Increase quantity"
              disabled={quantity >= product.stock}
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <p className="text-sm font-semibold text-gray-900">${lineTotal}</p>
        </div>
      </div>
    </div>
  )
}
