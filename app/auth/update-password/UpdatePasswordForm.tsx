'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import { updatePassword } from '@/lib/actions/auth'

export default function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state?.error} />

      <div className="space-y-1.5">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
        />
        <FieldError id="password-error" errors={state?.fieldErrors?.password} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.confirmPassword ? 'confirm-error' : undefined}
        />
        <FieldError id="confirm-error" errors={state?.fieldErrors?.confirmPassword} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Updating…' : 'Update Password'}
      </Button>
    </form>
  )
}
