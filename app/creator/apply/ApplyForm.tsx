'use client'

import { useActionState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/auth/FormField'
import FormError from '@/components/auth/FormError'
import { activateCreator } from '@/lib/actions/creator'

const INPUT_CLASS =
  'h-10 rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/[0.12] focus-visible:ring-offset-0'

const TEXTAREA_CLASS =
  'resize-none rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/[0.12] focus-visible:ring-offset-0'

export default function ApplyForm() {
  const [state, formAction, isPending] = useActionState(activateCreator, null)

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state?.error} />

      <FormField id="bio" label="Bio" errors={state?.fieldErrors?.bio}>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell us about yourself and the products you love to promote…"
          rows={3}
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.bio ? 'bio-error' : undefined}
          className={TEXTAREA_CLASS}
        />
      </FormField>

      <FormField id="promoCode" label="Promo Code" errors={state?.fieldErrors?.promoCode}>
        <Input
          id="promoCode"
          name="promoCode"
          type="text"
          placeholder="e.g. jane20 (optional)"
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.promoCode ? 'promoCode-error' : undefined}
          className={INPUT_CLASS}
        />
      </FormField>

      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-500">Social Links (optional)</p>

        <FormField id="instagram" label="Instagram" errors={state?.fieldErrors?.instagram}>
          <Input
            id="instagram"
            name="instagram"
            type="url"
            placeholder="https://instagram.com/yourhandle"
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.instagram ? 'instagram-error' : undefined}
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField id="youtube" label="YouTube" errors={state?.fieldErrors?.youtube}>
          <Input
            id="youtube"
            name="youtube"
            type="url"
            placeholder="https://youtube.com/@yourchannel"
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.youtube ? 'youtube-error' : undefined}
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField id="tiktok" label="TikTok" errors={state?.fieldErrors?.tiktok}>
          <Input
            id="tiktok"
            name="tiktok"
            type="url"
            placeholder="https://tiktok.com/@yourhandle"
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.tiktok ? 'tiktok-error' : undefined}
            className={INPUT_CLASS}
          />
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          'h-10 w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700',
          'text-sm font-semibold text-white',
          'shadow-[0_4px_14px_rgba(109,40,217,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]',
          'transition-all hover:from-violet-800 hover:to-indigo-800',
          'hover:shadow-[0_6px_18px_rgba(109,40,217,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Submit Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
