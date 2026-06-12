import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AuthCard from '@/components/auth/AuthCard'
import { AuthHeader } from '@/components/auth/AuthHeader'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')

  return (
    <AuthCard>
      <AuthHeader
        title="Create your account"
        subtitle="Join thousands of creators building on Facelo"
      />
      <RegisterForm />
    </AuthCard>
  )
}
