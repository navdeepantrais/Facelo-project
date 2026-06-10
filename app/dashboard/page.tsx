import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'
import BecomeCreatorButton from './BecomeCreatorButton'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  // Layout guarantees user is non-null and role === 'user'
  const user = await getCurrentUser()
  console.log('DashboardPage user:', user) 
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {user.fullName ?? user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Become a Creator</h2>
          <p className="mt-1 text-sm text-muted-foreground">
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
