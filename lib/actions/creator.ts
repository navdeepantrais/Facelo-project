'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db/index'
import { users, creators } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth'
import type { AuthActionResult } from '@/lib/actions/auth'
import { becomeCreatorSchema } from '@/lib/validators/creator'

export async function activateCreator(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated.' }
  if (user.role === 'admin') return { error: 'Admin accounts cannot become creators.' }

  // Short-circuit if creator record already exists
  const existing = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.userId, user.id))
    .limit(1)
  if (existing.length > 0) redirect('/creator/dashboard')

  const result = becomeCreatorSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const { bio, promoCode, instagram, youtube, tiktok } = result.data

  const base = (user.fullName ?? user.email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  const slug = `${base}-${crypto.randomUUID().slice(0, 8)}`

  const socialLinks: Record<string, string> = {}
  if (instagram) socialLinks.instagram = instagram
  if (youtube) socialLinks.youtube = youtube
  if (tiktok) socialLinks.tiktok = tiktok

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(creators)
        .values({
          userId: user.id,
          slug,
          status: 'approved',
          bio: bio ?? null,
          promoCode: promoCode ?? null,
          socialLinks,
        })
        // Only ignore conflicts on userId (race condition safety).
        // promoCode and slug conflicts bubble up to the catch block.
        .onConflictDoNothing({ target: creators.userId })
      await tx
        .update(users)
        .set({ role: 'creator', updatedAt: new Date() })
        .where(eq(users.id, user.id))
    })
  } catch (err) {
    const cause = (err as { cause?: { code?: string; constraint?: string; detail?: string } }).cause
    if (cause?.code === '23505') {
      const isPromoCode =
        cause.constraint?.includes('promo_code') || cause.detail?.includes('promo_code')
      if (isPromoCode) {
        return { fieldErrors: { promoCode: ['This promo code is already taken.'] } }
      }
    }
    console.error('activateCreator.failed', { userId: user.id })
    return { error: 'Failed to create creator account. Please try again.' }
  }

  redirect('/creator/dashboard')
}
