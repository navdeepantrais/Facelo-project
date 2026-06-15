'use client'

import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/types'

type Props = {
  product: Product
  className?: string
}

export function BuyNowButton({ product, className }: Props) {
  const router = useRouter()
  const { addToCart } = useCart()

  const isOutOfStock = product.stock <= 0

  function handleClick() {
    if (isOutOfStock) return
    addToCart(product, 1)
    router.push('/checkout')
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn('gap-2', className)}
      onClick={handleClick}
      disabled={isOutOfStock}
      aria-label={isOutOfStock ? 'Out of stock' : 'Buy now'}
    >
      <Zap className="h-4 w-4" />
      Buy now
    </Button>
  )
}
