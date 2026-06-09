'use client'

import { useActionState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation'
import { createClient } from '@/lib/supabase/client'
import { signUp } from '@/lib/actions/auth'

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUp, null)
  const [googlePending, startGoogleTransition] = useTransition()

  function handleGoogleSignUp() {
    startGoogleTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) toast.error(error.message)
    })
  }

  if (state?.success) {
    return (
      <EmailSentConfirmation
        title="Check your email"
        description="We sent a confirmation link to your inbox. Click it to activate your account."
      />
    )
  }

  const loading = isPending || googlePending

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={loading}
      >
        {googlePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <FormError message={state?.error} />

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Your name"
            autoComplete="name"
            required
            disabled={loading}
            aria-describedby={state?.fieldErrors?.fullName ? 'fullName-error' : undefined}
          />
          <FieldError id="fullName-error" errors={state?.fieldErrors?.fullName} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
            aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error" errors={state?.fieldErrors?.email} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            required
            disabled={loading}
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
          />
          <FieldError id="password-error" errors={state?.fieldErrors?.password} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
