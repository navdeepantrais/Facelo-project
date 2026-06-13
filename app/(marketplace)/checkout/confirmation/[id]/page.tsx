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
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold">Order placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. We&apos;ll be in touch with shipping updates.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Order ID:{' '}
          <span className="font-mono font-semibold">{formatOrderId(order.id)}</span>
        </p>
      </div>

      <OrderItemsList order={order} />
      <ShippingAddressDisplay shipping={shipping} />

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" render={<Link href="/account/orders" />}>
          View all orders
        </Button>
        <Button render={<Link href="/marketplace" />}>Continue shopping</Button>
      </div>
    </div>
  )
}
