import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/db/index'
import { creators } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'

export const metadata: Metadata = { title: 'Creator Dashboard' }

export default async function CreatorDashboardPage() {
  // Layout guarantees user is non-null and role is 'creator' or 'admin'
  const user = await getCurrentUser()
  if (!user) return null

  const [creator] = await db
    .select()
    .from(creators)
    .where(eq(creators.userId, user.id))
    .limit(1)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {creator ? `@${creator.slug}` : user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Videos</p>
            <p className="mt-1 text-2xl font-bold">0</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-2xl font-bold">0</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Commissions Earned</p>
            <p className="mt-1 text-2xl font-bold">$0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
