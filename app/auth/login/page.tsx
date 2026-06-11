import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { AuthHeader } from '@/components/auth/AuthHeader'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
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
