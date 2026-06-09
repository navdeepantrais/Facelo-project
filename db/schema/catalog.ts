import { pgTable, uuid, text, numeric, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { rewardTypeEnum } from './enums'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  images: text('images').array().notNull().default(sql`'{}'`),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  brand: text('brand'),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('0').notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  stock: integer('stock').default(0).notNull(),
  directRewardType: rewardTypeEnum('direct_reward_type').default('percentage').notNull(),
  directRewardValue: numeric('direct_reward_value', { precision: 10, scale: 2 }).default('10').notNull(),
  warmRewardType: rewardTypeEnum('warm_reward_type').default('percentage').notNull(),
  warmRewardValue: numeric('warm_reward_value', { precision: 10, scale: 2 }).default('5').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('products_category_id_idx').on(t.categoryId),
  index('products_is_active_idx').on(t.isActive),
])
