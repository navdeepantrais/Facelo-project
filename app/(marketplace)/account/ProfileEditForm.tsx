'use client'

import { useActionState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/auth/FormField'
import FormError from '@/components/auth/FormError'
import { updateProfile } from '@/lib/actions/auth'

const INPUT_CLASS =
  'h-10 rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/[0.12] focus-visible:ring-offset-0'

type Props = {
  defaultName: string
}

export default function ProfileEditForm({ defaultName }: Props) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-gray-900">Edit Profile</h2>

      <form action={formAction} className="flex flex-col gap-4">
        <FormError message={state?.error} />

        {state?.success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
            Profile updated successfully.
          </div>
        )}

        <FormField id="fullName" label="Full name" errors={state?.fieldErrors?.fullName}>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={defaultName}
            placeholder="Your full name"
            autoComplete="name"
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.fullName ? 'fullName-error' : undefined}
            className={INPUT_CLASS}
          />
        </FormField>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              'h-10 cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700',
              'px-6 text-sm font-semibold text-white',
              'shadow-[0_4px_14px_rgba(109,40,217,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]',
              'transition-all hover:from-violet-800 hover:to-indigo-800',
              'hover:shadow-[0_6px_18px_rgba(109,40,217,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
