'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CartItemRow } from '@/components/marketplace/CartItemRow'
import { useCart } from '@/hooks/use-cart'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: Props) {
  const { items, totalItems, totalPrice, clearCart } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart {totalItems > 0 && <span className="text-muted-foreground">({totalItems})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to get started.
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>

              <Button
                size="lg"
                className="w-full"
                render={<Link href="/checkout" onClick={() => onOpenChange(false)} />}
              >
                Proceed to Checkout
              </Button>

              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors text-center"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
