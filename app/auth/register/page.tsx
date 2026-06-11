import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { AuthHeader } from '@/components/auth/AuthHeader'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')

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
