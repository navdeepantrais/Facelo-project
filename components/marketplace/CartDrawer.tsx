'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CartItemRow } from '@/components/marketplace/CartItemRow'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: Props) {
  const { items, totalItems, totalPrice, clearCart } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[420px]">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-violet-600" />
            <SheetTitle className="text-base font-semibold">Your Cart</SheetTitle>
            {totalItems > 0 && (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <ShoppingCart className="h-9 w-9 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Your cart is empty</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Browse the marketplace and add products to get started.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              render={<Link href="/marketplace" onClick={() => onOpenChange(false)} />}
            >
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y px-6">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Order summary footer */}
            <div className="border-t bg-gray-50/80 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Subtotal</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Shipping and taxes calculated at checkout.
              </p>

              <Button
                size="lg"
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold hover:from-violet-700 hover:to-indigo-700"
                render={<Link href="/checkout" onClick={() => onOpenChange(false)} />}
              >
                Checkout · {formatPrice(totalPrice)}
              </Button>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Continue shopping
                </button>
                <button
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive text-xs transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
