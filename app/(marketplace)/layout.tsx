import { getCurrentUser } from '@/lib/auth'
import MarketplaceLayout from '@/components/layout/MarketplaceLayout'

export default async function MarketplaceGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  return (
    <MarketplaceLayout profile={user}>
      {children}
    </MarketplaceLayout>
  )
}
