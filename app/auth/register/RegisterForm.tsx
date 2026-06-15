'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowRight, Loader2, Lock, Mail, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { FormField } from '@/components/auth/FormField'
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation'
import FormError from '@/components/auth/FormError'
import { signUp } from '@/lib/actions/auth'
import { registerFormSchema, type RegisterFormInput } from '@/lib/validators/auth'

const INPUT_CLASS =
  'h-10 rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/[0.12] focus-visible:ring-offset-0'

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
  })

  async function onSubmit(data: RegisterFormInput) {
    const formData = new FormData()
    formData.set('fullName', data.fullName)
    formData.set('email', data.email)
    formData.set('password', data.password)

    const result = await signUp(null, formData)

    if (result?.success) {
      setSubmitted(true)
      return
    }
    if (result?.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        setError(field as keyof RegisterFormInput, { message: messages[0] })
      }
      return
    }
    if (result?.error) {
      setError('root', { message: result.error })
    }
  }

  if (submitted) {
    return (
      <EmailSentConfirmation
        title="Check your email"
        description="We sent a confirmation link to your inbox. Click it to activate your account."
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Google OAuth — primary path */}
      <OAuthButtons redirectTo={redirectTo} disabled={isSubmitting} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or continue with email</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Root error */}
      <FormError message={errors.root?.message} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {/* Full name */}
        <FormField
          id="fullName"
          label="Full name"
          errors={errors.fullName?.message ? [errors.fullName.message] : undefined}
        >
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={cn(INPUT_CLASS, 'pl-10')}
              {...register('fullName')}
            />
          </div>
        </FormField>

        {/* Email */}
        <FormField
          id="email"
          label="Email"
          errors={errors.email?.message ? [errors.email.message] : undefined}
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(INPUT_CLASS, 'pl-10')}
              {...register('email')}
            />
          </div>
        </FormField>

        {/* Password */}
        <FormField
          id="password"
          label="Password"
          errors={errors.password?.message ? [errors.password.message] : undefined}
        >
          <PasswordInput
            id="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={INPUT_CLASS}
            prefixIcon={<Lock className="h-4 w-4" />}
            {...register('password')}
          />
        </FormField>

        {/* Confirm password */}
        <FormField
          id="confirmPassword"
          label="Confirm password"
          errors={errors.confirmPassword?.message ? [errors.confirmPassword.message] : undefined}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            className={INPUT_CLASS}
            {...register('confirmPassword')}
          />
        </FormField>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(109,40,217,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:from-violet-800 hover:to-indigo-800 hover:shadow-[0_6px_18px_rgba(109,40,217,0.30),inset_0_1px_0_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-violet-600 hover:text-violet-700">
          Sign in
        </Link>
      </p>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400">
        By creating an account you agree to our{' '}
        <Link
          href="/terms"
          className="text-gray-500 underline underline-offset-4 hover:text-gray-700"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="text-gray-500 underline underline-offset-4 hover:text-gray-700"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
