import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import type { OrderWithItems } from '@/lib/actions/orders'

type Props = {
  order: OrderWithItems
}

export function OrderItemsList({ order }: Props) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="divide-y">
        {order.items.map((item) => {
          const product = item.product
          const firstImage = product?.images[0]
          return (
            <div key={item.id} className="flex gap-3 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={product?.name ?? 'Product'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">
                  {product?.name ?? 'Product unavailable'}
                </p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </p>
            </div>
          )
        })}
      </div>

      <Separator />

      <div className="flex items-center justify-between p-4">
        <span className="font-medium">Total</span>
        <span className="text-lg font-bold">{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}
