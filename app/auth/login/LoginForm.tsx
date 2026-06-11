'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
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
        <span className="text-muted-foreground text-xs">or</span>
        <Separator className="flex-1" />
      </div>

      <FormError message={state?.error} />

      <form action={formAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            required
            disabled={isPending}
            className="bg-muted/50 h-10"
            aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error" errors={state?.fieldErrors?.email} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/reset-password" className="text-primary text-xs hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            disabled={isPending}
            className="bg-muted/50 h-10"
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
          />
          <FieldError id="password-error" errors={state?.fieldErrors?.password} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-foreground cursor-pointer text-sm">
            Remember for 30 days
          </label>
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  )
}
