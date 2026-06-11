import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { AuthHeader } from '@/components/auth/AuthHeader'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')

  return (
    <AuthLayout panel={<AuthMarketingPanel />}>
      <AuthHeader title="Welcome back" subtitle="Please enter your details to sign in." />
      {/* Suspense required — LoginForm reads useSearchParams */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
