import Header from './Header'
import Footer from './Footer'
import type { User } from '@/types'

interface MarketplaceLayoutProps {
  children: React.ReactNode
  profile: User | null
  showFooter?: boolean
}

export default function MarketplaceLayout({
  children,
  profile,
  showFooter,
}: MarketplaceLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header profile={profile} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
