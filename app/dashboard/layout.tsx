import { redirect } from 'next/navigation'
import { getCurrentUser, getDashboardPath } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect('/auth/login')

  // Creators and admins have their own dashboards
  if (user.role !== 'user') {
    redirect(await getDashboardPath(user))
  }

  return <>{children}</>
}
