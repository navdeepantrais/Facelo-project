import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getOrder } from '@/lib/actions/orders'
import { Badge } from '@/components/ui/badge'
import { OrderItemsList } from '@/components/orders/OrderItemsList'
import { ShippingAddressDisplay } from '@/components/orders/ShippingAddressDisplay'
import { cn, formatOrderId, orderStatusColor } from '@/lib/utils'
import type { ShippingAddress } from '@/types'

export const metadata: Metadata = { title: 'Order Detail' }

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const [user, { id }] = await Promise.all([requireAuth(), params])
  const order = await getOrder(id, user.id)
  if (!order) notFound()

  const shipping = order.shippingAddress as ShippingAddress

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/account/orders"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex text-sm"
      >
        ← Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order {formatOrderId(order.id)}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge className={cn('text-sm capitalize', orderStatusColor(order.status))}>
          {order.status}
        </Badge>
      </div>

      <OrderItemsList order={order} />
      <ShippingAddressDisplay shipping={shipping} />
    </div>
  )
}
