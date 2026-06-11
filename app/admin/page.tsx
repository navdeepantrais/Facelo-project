import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'

export const metadata: Metadata = { title: 'Admin Dashboard' }

const ADMIN_SECTIONS = [
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Creators', href: '/admin/creators' },
  { label: 'Videos', href: '/admin/videos/moderation' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Attribution', href: '/admin/attribution' },
] as const

export default async function AdminPage() {
  // Layout guarantees user is non-null and role === 'admin'
  const user = await getCurrentUser()
  if (!user) return null

  const subRoleLabel = user.adminSubRole?.replace(/_/g, ' ') ?? 'admin'

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm capitalize">
              {subRoleLabel} — {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-card hover:bg-muted rounded-xl border p-6 transition-colors"
            >
              <p className="font-medium">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
