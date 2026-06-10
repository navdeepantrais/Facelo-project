import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { AuthHeader } from '@/components/auth/AuthHeader'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <AuthLayout panel={<AuthMarketingPanel />}>
      <AuthHeader
        title="Create your account"
        subtitle="Join Facelo to start shopping with creators you trust."
      />
      <RegisterForm />
    </AuthLayout>
  )
}
