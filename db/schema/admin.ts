import { pgTable, uuid, text, boolean, timestamp, unique } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { adminSubRoleEnum } from './enums'

export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: adminSubRoleEnum('name').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Uses role enum directly (not FK) — matches 001_initial_schema.sql
export const adminPermissions = pgTable('admin_permissions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  role: adminSubRoleEnum('role').notNull(),
  resource: text('resource').notNull(),
  canRead: boolean('can_read').default(false).notNull(),
  canWrite: boolean('can_write').default(false).notNull(),
  canApprove: boolean('can_approve').default(false).notNull(),
}, (t) => [unique().on(t.role, t.resource)])
