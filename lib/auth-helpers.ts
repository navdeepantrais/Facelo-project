import type { User as SupabaseUser } from '@supabase/supabase-js'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

// Upserts an auth.users record into the public users table.
// Called from the OAuth/email callback route — not a Server Action.
// On repeat sign-ins, updates email and avatar but never downgrades role.
export async function upsertUser(authUser: SupabaseUser): Promise<void> {
  await db
    .insert(users)
    .values({
      id: authUser.id,
      email: authUser.email!,
      fullName: authUser.user_metadata?.full_name ?? null,
      avatarUrl: authUser.user_metadata?.avatar_url ?? null,
      // role defaults to 'user' via DB default; upgraded only through admin actions
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: sql`excluded.email`,
        fullName: sql`excluded.full_name`,
        avatarUrl: sql`excluded.avatar_url`,
        updatedAt: sql`now()`,
      },
    })
}
