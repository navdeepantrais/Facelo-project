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

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type RewardType = 'percentage' | 'fixed'

export type AttributionType = 'direct' | 'warm' | 'none'

export type TrafficSource =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'telegram'
  | 'direct'
  | 'other'

export type VideoProvider = 'supabase' | 'youtube' | 'instagram' | 'tiktok'

export interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: UserRole
  adminSubRole: AdminSubRole | null
  status: AccountStatus
  createdAt: Date
  updatedAt: Date
}

export interface Creator {
  id: string
  user_id: string
  slug: string
  bio: string | null
  promo_code: string | null
  avatar_url: string | null
  status: CreatorStatus
  social_links: Record<string, string>
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  category?: Category
  brand: string | null
  rating: number
  review_count: number
  stock: number
  direct_reward_type: RewardType
  direct_reward_value: number
  warm_reward_type: RewardType
  warm_reward_value: number
  is_active: boolean
  created_at: string
}

export interface Video {
  id: string
  creator_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  storage_provider: VideoProvider
  upload_path: string | null
  playback_url: string | null
  external_url: string | null
  duration: number | null
  is_approved: boolean
  view_count: number
  products?: Product[]
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  shipping_address: ShippingAddress
  stripe_payment_intent_id: string | null
  attribution_session_id: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  attribution_type: AttributionType
}

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Commission {
  id: string
  order_item_id: string
  creator_id: string
  session_id: string
  attribution_type: AttributionType
  reward_type: RewardType
  computed_value: number
  is_reversed: boolean
  created_at: string
}

export interface AttributionSession {
  id: string
  creator_id: string
  user_id: string | null
  traffic_source: TrafficSource
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  expires_at: string
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}
