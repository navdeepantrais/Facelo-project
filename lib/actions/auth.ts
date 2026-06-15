'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db/index'
import { users, creators } from '@/db/schema'
import { upsertUser } from '@/lib/auth-helpers'
import {
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from '@/lib/validators/auth'
import type { User } from '@/types'
import { SITE_URL } from '@/constants/client'

// ─── Shared result type ───────────────────────────────────────────────────────
// Returned by every action that can fail with field or form-level errors.
// useActionState initialises with null; components check state?.error / state?.fieldErrors.
export type AuthActionResult = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
} | null

// ─── signIn ───────────────────────────────────────────────────────────────────
export async function signIn(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const result = signInSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const { email, password, redirectTo } = result.data
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === 'invalid_credentials') {
      return { error: 'Incorrect email or password.' }
    }
    if (error.code === 'email_not_confirmed') {
      return { error: 'Please confirm your email before signing in.' }
    }
    return { error: error.message }
  }

  // Validate profile exists in public.users
  const profile = await getUser()
  if (!profile) {
    await supabase.auth.signOut()
    return { error: 'Account profile not found. Please contact support.' }
  }

  // Block access for inactive accounts
  if (profile.status !== 'active') {
    await supabase.auth.signOut()
    if (profile.status === 'blocked') return { error: 'Your account has been blocked.' }
    if (profile.status === 'suspended') return { error: 'Your account has been suspended.' }
    if (profile.status === 'deleted') return { error: 'This account no longer exists.' }
    return { error: 'Your account is not active. Please contact support.' }
  }

  // Honour explicit redirectTo (set by middleware when protecting a route)
  if (redirectTo?.startsWith('/') && !redirectTo.startsWith('//')) {
    redirect(redirectTo)
  }

  // Admin routes directly
  if (profile.role === 'admin') redirect('/admin')

  // Creator routing — determined by creator record, not role field
  const creatorRows = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.userId, profile.id))
    .limit(1)

  if (creatorRows.length > 0) redirect('/creator/dashboard')
  // Regular users land on the marketplace homepage
  redirect('/')
}

// ─── signUp ───────────────────────────────────────────────────────────────────
export async function signUp(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const result = signUpSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const { fullName, email, password } = result.data
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${SITE_URL}/auth/callback?redirectTo=/auth/verify`,
    },
  })

  if (error) {
    if (error.code === 'user_already_exists') {
      return { fieldErrors: { email: ['An account with this email already exists.'] } }
    }
    return { error: error.message }
  }

  // Create the public.users profile immediately.
  // onConflictDoUpdate in upsertUser handles the rare case where the record already exists.
  if (data.user) {
    await upsertUser(data.user)
  }

  return { success: true }
}

// ─── signOut ──────────────────────────────────────────────────────────────────
export async function signOut(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

// ─── resetPassword ────────────────────────────────────────────────────────────
export async function resetPassword(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${SITE_URL}/auth/callback?redirectTo=/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// ─── updatePassword ───────────────────────────────────────────────────────────
export async function updatePassword(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const result = updatePasswordSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: result.data.password })

  if (error) {
    if (error.code === 'same_password') {
      return { fieldErrors: { password: ['New password must differ from the current one.'] } }
    }
    return { error: error.message }
  }

  redirect('/auth/login?message=password-updated')
}

// ─── updateProfile ────────────────────────────────────────────────────────────
export async function updateProfile(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const user = await getUser()
  if (!user) return { error: 'Not authenticated.' }

  const result = updateProfileSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  await db
    .update(users)
    .set({ fullName: result.data.fullName, updatedAt: new Date() })
    .where(eq(users.id, user.id))

  revalidatePath('/account')
  return { success: true }
}

// ─── getUser ──────────────────────────────────────────────────────────────────
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  if (!authUser) return null

  const rows = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1)

  return rows[0] ?? null
}
