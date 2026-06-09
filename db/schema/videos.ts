import { pgTable, uuid, text, integer, boolean, timestamp, unique, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { videoProviderEnum } from './enums'
import { creators } from './users'
import { products } from './catalog'

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  creatorId: uuid('creator_id').references(() => creators.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  storageProvider: videoProviderEnum('storage_provider').default('supabase').notNull(),
  uploadPath: text('upload_path'),
  playbackUrl: text('playback_url'),
  externalUrl: text('external_url'),
  duration: integer('duration'),
  isApproved: boolean('is_approved').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('videos_creator_id_idx').on(t.creatorId),
  index('videos_is_approved_idx').on(t.isApproved),
])

export const videoProducts = pgTable('video_products', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  position: integer('position').default(0).notNull(),
}, (t) => [
  unique().on(t.videoId, t.productId),
  index('video_products_video_id_idx').on(t.videoId),
  index('video_products_product_id_idx').on(t.productId),
])
