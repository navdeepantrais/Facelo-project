import { pgTable, uuid, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { userRoleEnum, adminSubRoleEnum, creatorStatusEnum, accountStatusEnum } from './enums'

// id mirrors auth.users.id — FK enforced in db/rls.sql (cross-schema, not expressible in Drizzle)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('user').notNull(),
  adminSubRole: adminSubRoleEnum('admin_sub_role'),
  status: accountStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('users_email_idx').on(t.email),
  index('users_role_idx').on(t.role),
  index('users_status_idx').on(t.status),
])

export const creators = pgTable('creators', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  slug: text('slug').unique().notNull(),
  bio: text('bio'),
  promoCode: text('promo_code').unique(),
  avatarUrl: text('avatar_url'),
  status: creatorStatusEnum('status').default('pending_review').notNull(),
  socialLinks: jsonb('social_links').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('creators_user_id_idx').on(t.userId),
  index('creators_status_idx').on(t.status),
])
