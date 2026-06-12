import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AuthCard from '@/components/auth/AuthCard'
import { AuthHeader } from '@/components/auth/AuthHeader'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" subtitle="Sign in to your Facelo account" />
      {/* Suspense required — LoginForm reads useSearchParams */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  )
}
