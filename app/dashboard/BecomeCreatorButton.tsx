'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FormError from '@/components/auth/FormError'
import FieldError from '@/components/auth/FieldError'
import { activateCreator } from '@/lib/actions/creator'

export default function BecomeCreatorForm() {
  const [state, formAction, isPending] = useActionState(activateCreator, null)

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state?.error} />

      <div className="space-y-1.5">
        <Label htmlFor="bio">
          Bio{' '}
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell your audience about yourself and what you create…"
          rows={3}
          maxLength={500}
          disabled={isPending}
          aria-describedby={state?.fieldErrors?.bio ? 'bio-error' : undefined}
        />
        <FieldError id="bio-error" errors={state?.fieldErrors?.bio} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="promoCode">
          Promo Code{' '}
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="promoCode"
          name="promoCode"
          placeholder="e.g. creator20"
          autoComplete="off"
          disabled={isPending}
          aria-describedby={
            state?.fieldErrors?.promoCode ? 'promoCode-error' : 'promoCode-hint'
          }
        />
        <p id="promoCode-hint" className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and hyphens only. This appears in your referral links.
        </p>
        <FieldError id="promoCode-error" errors={state?.fieldErrors?.promoCode} />
      </div>

      <fieldset className="space-y-3" disabled={isPending}>
        <legend className="text-sm font-medium">
          Social Links{' '}
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </legend>

        <div className="space-y-1.5">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            type="url"
            placeholder="https://instagram.com/yourhandle"
            aria-describedby={state?.fieldErrors?.instagram ? 'instagram-error' : undefined}
          />
          <FieldError id="instagram-error" errors={state?.fieldErrors?.instagram} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            name="youtube"
            type="url"
            placeholder="https://youtube.com/@yourchannel"
            aria-describedby={state?.fieldErrors?.youtube ? 'youtube-error' : undefined}
          />
          <FieldError id="youtube-error" errors={state?.fieldErrors?.youtube} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input
            id="tiktok"
            name="tiktok"
            type="url"
            placeholder="https://tiktok.com/@yourhandle"
            aria-describedby={state?.fieldErrors?.tiktok ? 'tiktok-error' : undefined}
          />
          <FieldError id="tiktok-error" errors={state?.fieldErrors?.tiktok} />
        </div>
      </fieldset>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Setting up your account…' : 'Become a Creator'}
      </Button>
    </form>
  )
}
