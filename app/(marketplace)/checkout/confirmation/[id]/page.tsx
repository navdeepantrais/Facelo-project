import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { getOrder } from '@/lib/actions/orders'
import { Button } from '@/components/ui/button'
import { OrderItemsList } from '@/components/orders/OrderItemsList'
import { ShippingAddressDisplay } from '@/components/orders/ShippingAddressDisplay'
import { formatOrderId } from '@/lib/utils'
import type { ShippingAddress } from '@/types'

export const metadata: Metadata = { title: 'Order Confirmed' }

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const [{ id }, user] = await Promise.all([params, requireAuth('/checkout')])

  const order = await getOrder(id, user.id)
  if (!order) notFound()

  const shipping = order.shippingAddress as ShippingAddress

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold">Order placed!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your order. We&apos;ll be in touch with shipping updates.
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Order ID: <span className="font-mono font-semibold">{formatOrderId(order.id)}</span>
        </p>
      </div>

      <OrderItemsList order={order} />
      <ShippingAddressDisplay shipping={shipping} />

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="outline" render={<Link href="/account/orders" />}>
          View all orders
        </Button>
        <Button render={<Link href="/marketplace" />}>Continue shopping</Button>
      </div>
    </div>
  )
}
