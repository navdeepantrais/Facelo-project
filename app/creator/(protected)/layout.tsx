import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect('/auth/login')

  // Regular users haven't activated creator mode yet — send them to account where they can become a creator
  if (user.role === 'user') redirect('/account')

  // role === 'creator' or role === 'admin' — allow through
  return <>{children}</>
}
