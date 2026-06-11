import type {
  users,
  creators,
  categories,
  products,
  videos,
  orders,
  orderItems,
  commissions,
  sessions,
} from '@/db/schema'

// ─── Enum union types ─────────────────────────────────────────────────────────
// Kept as explicit TypeScript types so they can be imported and used as
// function parameter/return types without pulling in Drizzle internals.

export type UserRole = 'user' | 'creator' | 'admin'

export type AccountStatus = 'active' | 'blocked' | 'suspended' | 'deleted'

export type AdminSubRole =
  | 'super_admin'
  | 'product_manager'
  | 'creator_manager'
  | 'order_manager'
  | 'moderator'

export type CreatorStatus = 'pending_review' | 'approved' | 'suspended'

export type PaymentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded'

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded'

export type RewardType = 'percentage' | 'fixed'

export type AttributionType = 'direct' | 'warm' | 'none'

export type TrafficSource = 'instagram' | 'youtube' | 'tiktok' | 'telegram' | 'direct' | 'other'

export type VideoProvider = 'supabase' | 'youtube' | 'instagram' | 'tiktok'

// ─── DB row types ─────────────────────────────────────────────────────────────
// Single source of truth: derived directly from Drizzle schema.
// Never duplicate field names or types here — change the schema and re-derive.

export type User = typeof users.$inferSelect
export type Creator = typeof creators.$inferSelect
export type Category = typeof categories.$inferSelect
export type Product = typeof products.$inferSelect
export type Video = typeof videos.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type Commission = typeof commissions.$inferSelect
export type AttributionSession = typeof sessions.$inferSelect

// ─── Marketplace types ────────────────────────────────────────────────────────

export type ProductWithCategory = Product & {
  category: Category | null
}

export type VideoWithProducts = {
  video: Video
  products: ProductWithCategory[]
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity'

export type ProductFilters = {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  creator?: string
  rating?: number
  sort?: SortOption
  page?: number
}

export type PaginatedProducts = {
  products: ProductWithCategory[]
  total: number
  page: number
  totalPages: number
}

// ─── Non-table types ──────────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface CartItem {
  product: Product
  quantity: number
}
