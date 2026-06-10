import { cache } from 'react'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db/index'
import { users, creators, adminPermissions } from '@/db/schema'
import type { User, UserRole, AdminSubRole } from '@/types'

// cache() deduplicates this across layout + page in the same server render
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  if (!authUser) return null

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  return rows[0] ?? null
})

export async function requireAuth(returnPath?: string): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    const loginUrl = returnPath
      ? `/auth/login?redirectTo=${encodeURIComponent(returnPath)}`
      : '/auth/login'
    redirect(loginUrl)
  }
  return user
}

export function isAuthenticated(user: User | null): user is User {
  return user !== null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export async function isCreator(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false
  const rows = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.userId, userId))
    .limit(1)
  return rows.length > 0
}

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}

export async function hasPermission(
  subRole: AdminSubRole | null,
  resource: string,
  action: 'canRead' | 'canWrite' | 'canApprove',
): Promise<boolean> {
  if (!subRole) return false
  if (subRole === 'super_admin') return true

  const rows = await db
    .select()
    .from(adminPermissions)
    .where(
      and(
        eq(adminPermissions.role, subRole),
        eq(adminPermissions.resource, resource),
      ),
    )
    .limit(1)

  const perm = rows[0]
  if (!perm) return false
  return perm[action]
}

export async function getDashboardPath(user: User): Promise<string> {
  if (user.role === 'admin') return '/admin'
  const rows = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.userId, user.id))
    .limit(1)
  if (rows.length > 0) return '/creator/dashboard'
  return '/dashboard'
}
