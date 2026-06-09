import type { Metadata } from 'next'
import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <AuthCard title="Create an account" subtitle="Join Facelo to start shopping">
      <RegisterForm />
    </AuthCard>
  )
}
