'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import { signIn } from '@/lib/actions/auth'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <div className="space-y-5">
      <OAuthButtons redirectTo={redirectTo} disabled={isPending} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <FormError message={state?.error} />

      <form action={formAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/reset-password"
              className="text-xs text-muted-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
          />
          <FieldError id="password-error" errors={state?.fieldErrors?.password} />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
