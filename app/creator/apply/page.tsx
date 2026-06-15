import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AuthCard from '@/components/auth/AuthCard'
import { AuthHeader } from '@/components/auth/AuthHeader'
import ApplyForm from './ApplyForm'
import ApplySignInPrompt from './ApplySignInPrompt'

export const metadata: Metadata = { title: 'Become a Creator | Facelo' }

export default async function CreatorApplyPage() {
  const user = await getCurrentUser()

  // Already a creator — nothing to apply for
  if (user?.role === 'creator') redirect('/creator/dashboard')

  // Admins cannot become creators
  if (user?.role === 'admin') redirect('/')

  return (
    <AuthCard>
      <AuthHeader
        title="Become a Creator"
        subtitle="Share products you love and earn commission on every sale."
      />
      {user ? <ApplyForm /> : <ApplySignInPrompt />}
    </AuthCard>
  )
}
