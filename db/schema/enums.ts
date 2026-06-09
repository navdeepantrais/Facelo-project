import { pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['user', 'creator', 'admin'])

export const adminSubRoleEnum = pgEnum('admin_sub_role', [
  'super_admin',
  'product_manager',
  'creator_manager',
  'order_manager',
  'moderator',
])

export const creatorStatusEnum = pgEnum('creator_status', [
  'pending_review',
  'approved',
  'suspended',
])

export const rewardTypeEnum = pgEnum('reward_type', ['percentage', 'fixed'])

export const attributionTypeEnum = pgEnum('attribution_type', [
  'direct',
  'warm',
  'none',
])

export const attributionModelEnum = pgEnum('attribution_model', [
  'last_touch',
  'first_touch',
  'split',
])

export const videoProviderEnum = pgEnum('video_provider', [
  'supabase',
  'youtube',
  'instagram',
  'tiktok',
])

// Values match 001_initial_schema.sql — 'paid' and 'completed' instead of 'confirmed'/'shipped'/'delivered'
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'processing',
  'completed',
  'cancelled',
  'refunded',
])

export const trafficSourceEnum = pgEnum('traffic_source', [
  'instagram',
  'youtube',
  'tiktok',
  'telegram',
  'direct',
  'other',
])
