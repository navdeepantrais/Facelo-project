import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-background mt-auto border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              Facelo
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              Shop products recommended by creators you trust.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Marketplace</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-foreground">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-foreground">
                  Shop from Videos
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-foreground">
                  Creators
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Account</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:text-foreground">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-foreground">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>&copy; {new Date().getFullYear()} Facelo. All rights reserved.</p>
          <p>Built with creators in mind.</p>
        </div>
      </div>
    </footer>
  )
}
