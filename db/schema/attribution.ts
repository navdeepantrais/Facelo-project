import { pgTable, uuid, text, integer, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { trafficSourceEnum, attributionModelEnum } from './enums'
import { users, creators } from './users'
import { videos } from './videos'
import { products } from './catalog'

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  creatorId: uuid('creator_id').references(() => creators.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  trafficSource: trafficSourceEnum('traffic_source').default('direct').notNull(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('sessions_creator_id_idx').on(t.creatorId),
  index('sessions_user_id_idx').on(t.userId),
  index('sessions_expires_at_idx').on(t.expiresAt),
])

export const trafficSources = pgTable('traffic_sources', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  source: trafficSourceEnum('source').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('traffic_sources_session_id_idx').on(t.sessionId),
])

export const referralEvents = pgTable('referral_events', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  creatorId: uuid('creator_id').references(() => creators.id, { onDelete: 'set null' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('referral_events_session_id_idx').on(t.sessionId),
  index('referral_events_creator_id_idx').on(t.creatorId),
  index('referral_events_product_id_idx').on(t.productId),
])

export const clickEvents = pgTable('click_events', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('click_events_video_id_idx').on(t.videoId),
  index('click_events_product_id_idx').on(t.productId),
  index('click_events_session_id_idx').on(t.sessionId),
])

export const attributionConfig = pgTable('attribution_config', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  windowDays: integer('window_days').default(7).notNull(),
  model: attributionModelEnum('model').default('last_touch').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
