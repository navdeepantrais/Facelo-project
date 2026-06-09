'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import type { User } from '@/types'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  return {
    id: row.id,
    email: row.email,
    full_name: row.fullName ?? null,
    avatar_url: row.avatarUrl ?? null,
    role: row.role,
    admin_sub_role: row.adminSubRole ?? null,
    created_at: row.createdAt.toISOString(),
  }
}
