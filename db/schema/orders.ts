import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { orderStatusEnum, attributionTypeEnum, rewardTypeEnum, paymentStatusEnum } from './enums'
import { users, creators } from './users'
import { products } from './catalog'
import { sessions } from './attribution'

export const orders = pgTable(
  'orders',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    status: orderStatusEnum('status').default('pending').notNull(),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    shippingAddress: jsonb('shipping_address').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
    attributionSessionId: uuid('attribution_session_id').references(() => sessions.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('orders_user_id_idx').on(t.userId),
    index('orders_status_idx').on(t.status),
    index('orders_attribution_session_id_idx').on(t.attributionSessionId),
  ]
)

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    attributionType: attributionTypeEnum('attribution_type').default('none').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('order_items_order_id_idx').on(t.orderId),
    index('order_items_product_id_idx').on(t.productId),
  ]
)

export const payments = pgTable(
  'payments',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id').notNull().unique(),
    stripeCustomerId: text('stripe_customer_id'),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('usd').notNull(),
    status: paymentStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('payments_order_id_idx').on(t.orderId)]
)

export const refunds = pgTable(
  'refunds',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    stripeRefundId: text('stripe_refund_id').unique(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    initiatorId: uuid('initiator_id').references(() => users.id, { onDelete: 'set null' }),
    originalCommissionValue: numeric('original_commission_value', { precision: 10, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('refunds_order_id_idx').on(t.orderId),
    index('refunds_initiator_id_idx').on(t.initiatorId),
  ]
)

export const commissions = pgTable(
  'commissions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderItemId: uuid('order_item_id')
      .references(() => orderItems.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    creatorId: uuid('creator_id')
      .references(() => creators.id, { onDelete: 'cascade' })
      .notNull(),
    sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
    attributionType: attributionTypeEnum('attribution_type').notNull(),
    rewardType: rewardTypeEnum('reward_type').notNull(),
    computedValue: numeric('computed_value', { precision: 10, scale: 2 }).notNull(),
    isReversed: boolean('is_reversed').default(false).notNull(),
    isPaid: boolean('is_paid').default(false).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('commissions_creator_id_idx').on(t.creatorId),
    index('commissions_session_id_idx').on(t.sessionId),
    index('commissions_is_paid_idx').on(t.isPaid),
    index('commissions_creator_is_paid_idx').on(t.creatorId, t.isPaid),
  ]
)
