'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation'
import { resetPassword } from '@/lib/actions/auth'

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, null)

  if (state?.success) {
    return (
      <EmailSentConfirmation
        title="Check your email"
        description="We sent a password reset link to your inbox."
      />
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state?.error} />

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
        />
        <FieldError id="email-error" errors={state?.fieldErrors?.email} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Sending…' : 'Send Reset Link'}
      </Button>

      <p className="text-center text-sm">
        <Link href="/auth/login" className="text-muted-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
