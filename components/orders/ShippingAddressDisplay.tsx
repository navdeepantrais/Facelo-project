import type { ShippingAddress } from '@/types'

type Props = {
  shipping: ShippingAddress
}

export function ShippingAddressDisplay({ shipping }: Props) {
  return (
    <div className="bg-card mt-6 rounded-xl border p-4">
      <h2 className="mb-3 font-semibold">Shipping Address</h2>
      <address className="text-muted-foreground space-y-0.5 text-sm not-italic">
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
