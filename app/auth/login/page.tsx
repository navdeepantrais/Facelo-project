import { Suspense } from 'react'
import type { Metadata } from 'next'
import AuthCard from '@/components/auth/AuthCard'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Facelo account">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  )
}
