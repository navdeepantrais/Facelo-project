import type { Metadata } from 'next'
import AuthCard from '@/components/auth/AuthCard'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = { title: 'Reset Password' }

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <ResetPasswordForm />
    </AuthCard>
  )
}
