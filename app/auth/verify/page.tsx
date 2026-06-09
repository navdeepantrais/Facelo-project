import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Verify Email' }

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">Email verified!</h1>
      <p className="text-muted-foreground">Your account is active. You can now sign in.</p>
      <Button render={<Link href="/auth/login" />}>Go to Sign In</Button>
    </div>
  )
}
