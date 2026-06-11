'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import EmailSentConfirmation from '@/components/auth/EmailSentConfirmation'
import FormError from '@/components/auth/FormError'
import { signUp } from '@/lib/actions/auth'
import { registerFormSchema, type RegisterFormInput } from '@/lib/validators/auth'

export default function RegisterForm() {
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
    <div className="space-y-5">
      <OAuthButtons disabled={isSubmitting} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <Separator className="flex-1" />
      </div>

      <FormError message={errors.root?.message} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Your name"
            autoComplete="name"
            disabled={isSubmitting}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-destructive text-xs">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-xs">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-muted-foreground text-center text-xs">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="hover:text-foreground underline underline-offset-4">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="hover:text-foreground underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
