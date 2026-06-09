import type { Metadata } from 'next'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Facelo to start shopping</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
