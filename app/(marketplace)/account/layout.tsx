import { requireAuth } from '@/lib/auth'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Redirects to /auth/login if not authenticated
  await requireAuth()
  return <>{children}</>
}
