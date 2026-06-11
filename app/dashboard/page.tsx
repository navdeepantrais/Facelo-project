import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'
import BecomeCreatorButton from '@/components/creator/BecomeCreatorForm'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  // Layout guarantees user is non-null and role === 'user'
  const user = await getCurrentUser()
  if (!user) return null

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Welcome back, {user.fullName ?? user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Become a Creator</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Share products with your audience and earn commissions on every sale.
          </p>
          <div className="mt-4">
            <BecomeCreatorButton />
          </div>
        </div>
      </div>
    </div>
  )
}
