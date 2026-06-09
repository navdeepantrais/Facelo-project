import Header from './Header'
import Footer from './Footer'
import type { User } from '@/types'

interface MarketplaceLayoutProps {
  children: React.ReactNode
  profile: User | null
  cartCount?: number
  onSignOut: () => void
}

export default function MarketplaceLayout({
  children,
  profile,
  cartCount,
  onSignOut,
}: MarketplaceLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header profile={profile} cartCount={cartCount} onSignOut={onSignOut} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
