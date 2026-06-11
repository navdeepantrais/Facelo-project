import type { ShippingAddress } from '@/types'

type Props = {
  shipping: ShippingAddress
}

export function ShippingAddressDisplay({ shipping }: Props) {
  return (
    <div className="mt-6 rounded-xl border bg-card p-4">
      <h2 className="font-semibold mb-3">Shipping Address</h2>
      <address className="text-sm text-muted-foreground not-italic space-y-0.5">
        <p>{shipping.full_name}</p>
        <p>{shipping.address_line1}</p>
        {shipping.address_line2 && <p>{shipping.address_line2}</p>}
        <p>
          {shipping.city}, {shipping.state} {shipping.postal_code}
        </p>
        <p>{shipping.country}</p>
      </address>
    </div>
  )
}
