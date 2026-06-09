'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import {
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  updatePasswordSchema,
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
  formData: FormData,
): Promise<AuthActionResult> {
  const result = signInSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const { email, password, redirectTo } = result.data
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Map Supabase error to a user-friendly message
    if (error.code === 'invalid_credentials') {
      return { error: 'Incorrect email or password.' }
    }
    if (error.code === 'email_not_confirmed') {
      return { error: 'Please confirm your email before signing in.' }
    }
    return { error: error.message }
  }

  // Only redirect to relative paths — reject absolute URLs and protocol-relative URLs (//evil.com)
  const safe =
    redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/'
  redirect(safe)
}

// ─── signUp ───────────────────────────────────────────────────────────────────
export async function signUp(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const result = signUpSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors }
  }

  const { fullName, email, password } = result.data
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
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
  formData: FormData,
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
  formData: FormData,
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

// ─── getUser ──────────────────────────────────────────────────────────────────
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  return rows[0] ?? null
}
