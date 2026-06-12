'use client'

import { useActionState, type CSSProperties } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { GoogleLoginButton } from '@/components/auth/google-login-button'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import { signIn } from '@/lib/actions/auth'

const INPUT =
  'h-12 rounded-xl border border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-0 focus-visible:bg-white/[0.08]'

const DARK_MUTED: CSSProperties = {
  '--muted-foreground': 'rgba(255,255,255,0.28)',
  '--foreground': 'rgba(255,255,255,0.65)',
} as CSSProperties

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:items-start lg:px-14">
      <div className="w-full max-w-sm lg:max-w-[360px]">
        {/* Section heading */}
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          Welcome back
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Sign in to Facelo</h2>
        <p className="mt-1.5 text-sm text-white/40">Continue building your creator business.</p>

        <FormError message={state?.error} />

        {/* Google — primary CTA */}
        <div className="mt-7">
          <GoogleLoginButton redirectTo={redirectTo} disabled={isPending} />
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <span className="text-[10px] uppercase tracking-widest text-white/20">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        {/* Email + password form */}
        <form action={formAction} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-white/50">
              Email address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isPending}
                className={cn(INPUT, 'pl-10')}
                aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
              />
            </div>
            <FieldError id="email-error" errors={state?.fieldErrors?.email} />
          </div>

          {/* Password — override muted colors for dark bg eye-toggle visibility */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-white/50">
              Password
            </Label>
            <div style={DARK_MUTED}>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className={INPUT}
                prefixIcon={<Lock className="h-4 w-4" />}
                aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
              />
            </div>
            <FieldError id="password-error" errors={state?.fieldErrors?.password} />
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                className="border-white/20 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
              />
              <label htmlFor="remember" className="cursor-pointer text-sm text-white/45">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-12 w-full rounded-xl bg-white font-semibold text-[#09090B] transition-colors hover:bg-white/90 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
