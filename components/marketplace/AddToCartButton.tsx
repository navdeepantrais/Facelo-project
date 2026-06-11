'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/types'

type Props = {
  product: Product
  quantity?: number
  className?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = 'default',
  size = 'default',
}: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const isOutOfStock = product.stock <= 0

  function handleClick() {
    if (isOutOfStock || added) return
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      onClick={handleClick}
      disabled={isOutOfStock}
      aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
    >
      <ShoppingCart className="h-4 w-4" />
      {isOutOfStock ? 'Out of stock' : added ? 'Added!' : 'Add to cart'}
    </Button>
  )
}
