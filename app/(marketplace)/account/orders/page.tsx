import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { getUserOrders } from '@/lib/actions/orders'
import { Badge } from '@/components/ui/badge'
import { Paginator } from '@/components/marketplace/Paginator'
import { cn, formatPrice, formatOrderId, orderStatusColor } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Orders' }

type PageProps = {
  searchParams: Promise<Record<string, string>>
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const user = await requireAuth()
  const params = await searchParams
  const page = params.page ? Number(params.page) : 1

  const { orders, total, totalPages } = await getUserOrders(user.id, page)

  function buildHref(p: number) {
    return `/account/orders?page=${p}`
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <span className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start shopping and your orders will appear here.
          </p>
          <Link href="/products" className="mt-4 text-sm font-medium text-primary hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatOrderId(order.id)}
                    </span>
                    <Badge className={cn('text-xs capitalize', orderStatusColor(order.status))}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <p className="text-base font-semibold">{formatPrice(order.total)}</p>
              </Link>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Paginator page={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      )}
    </div>
  )
}
