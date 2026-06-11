import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getDashboardPath } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(await getDashboardPath(user))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-bold">Welcome to Facelo</h1>
      <p className="text-muted-foreground max-w-md">
        Shop products recommended by creators you trust.
      </p>
      <div className="flex gap-3">
        <Button render={<Link href="/auth/login" />}>Sign In</Button>
        <Button variant="outline" render={<Link href="/auth/register" />}>
          Create Account
        </Button>
      </div>
    </div>
  )
}
