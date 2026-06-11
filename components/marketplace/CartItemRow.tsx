'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import type { CartItem } from '@/hooks/use-cart'

type Props = {
  item: CartItem
}

export function CartItemRow({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item
  const firstImage = product.images[0]

  return (
    <div className="flex gap-3 py-3">
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-sm font-semibold">${Number(product.price).toFixed(2)}</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(product.id)}
        aria-label={`Remove ${product.name} from cart`}
        className="self-start text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
