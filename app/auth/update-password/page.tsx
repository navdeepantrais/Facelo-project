import type { Metadata } from 'next'
import AuthCard from '@/components/auth/AuthCard'
import UpdatePasswordForm from './UpdatePasswordForm'

export const metadata: Metadata = { title: 'Update Password' }

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Set new password" subtitle="Choose a strong password for your account">
      <UpdatePasswordForm />
    </AuthCard>
  )
}
