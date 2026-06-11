'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CartItemRow } from '@/components/marketplace/CartItemRow'
import { useCart } from '@/hooks/use-cart'
import { createOrder } from '@/lib/actions/orders'
import { shippingAddressSchema } from '@/lib/validators/checkout'
import type { ShippingAddressInput } from '@/lib/validators/checkout'

export function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
  })

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">Add some products before checking out.</p>
      </div>
    )
  }

  function onSubmit(data: ShippingAddressInput) {
    setServerError(null)
    startTransition(async () => {
      const cartItems = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }))
      const result = await createOrder({
        items: cartItems,
        shippingAddress: data,
      })
      if (result.success) {
        clearCart()
        router.push(`/checkout/confirmation/${result.orderId}`)
      } else {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Shipping form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...register('full_name')} placeholder="Jane Smith" />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address_line1">Address</Label>
              <Input
                id="address_line1"
                {...register('address_line1')}
                placeholder="123 Main Street"
              />
              {errors.address_line1 && (
                <p className="text-xs text-destructive">{errors.address_line1.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address_line2">
                Apartment, suite, etc.{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="address_line2"
                {...register('address_line2')}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} placeholder="New York" />
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" {...register('state')} placeholder="NY" />
                {errors.state && (
                  <p className="text-xs text-destructive">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="postal_code">Postal code</Label>
                <Input id="postal_code" {...register('postal_code')} placeholder="10001" />
                {errors.postal_code && (
                  <p className="text-xs text-destructive">{errors.postal_code.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} placeholder="United States" />
                {errors.country && (
                  <p className="text-xs text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {serverError && (
          <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Placing order…' : `Place order · $${totalPrice.toFixed(2)}`}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Payment will be collected when your order is confirmed. You won&apos;t be charged yet.
        </p>
      </form>

      {/* Order summary */}
      <div className="rounded-xl border bg-card h-fit">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Order summary{' '}
            <span className="text-muted-foreground font-normal text-sm">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </h2>
        </div>

        <div className="divide-y px-4">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>

        <Separator />

        <div className="p-4 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
