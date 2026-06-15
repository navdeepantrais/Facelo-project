'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { FormField } from '@/components/auth/FormField'
import FormError from '@/components/auth/FormError'
import { signIn } from '@/lib/actions/auth'

const INPUT_CLASS =
  'h-10 rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/[0.12] focus-visible:ring-offset-0'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <div className="space-y-4">
      {/* Google OAuth — primary path */}
      <OAuthButtons redirectTo={redirectTo} disabled={isPending} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or continue with email</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Form-level error */}
      <FormError message={state?.error} />

      <form action={formAction} className="space-y-3">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        {/* Email */}
        <FormField id="email" label="Email" errors={state?.fieldErrors?.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={isPending}
              className={cn(INPUT_CLASS, 'pl-10')}
              aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
            />
          </div>
        </FormField>

        {/* Password */}
        <FormField
          id="password"
          label="Password"
          errors={state?.fieldErrors?.password}
          action={
            <Link
              href="/auth/reset-password"
              className="text-xs font-medium text-violet-600 hover:text-violet-700"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isPending}
            className={INPUT_CLASS}
            prefixIcon={<Lock className="h-4 w-4" />}
            aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
          />
        </FormField>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            className="data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
          />
          <label htmlFor="remember" className="cursor-pointer text-sm text-gray-600 select-none">
            Keep me signed in
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:from-violet-800 hover:to-indigo-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.30),inset_0_1px_0_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign up */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium text-violet-600 hover:text-violet-700">
          Sign up for free
        </Link>
      </p>
    </div>
  )
}
