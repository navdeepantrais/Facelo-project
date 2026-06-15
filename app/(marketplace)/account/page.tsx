import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, CreditCard, MapPin, Package, Shield, Truck } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserOrders } from '@/lib/actions/orders'
import { getFeaturedProducts } from '@/lib/actions/marketplace'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  cn,
  formatOrderId,
  orderProgressLabels,
  orderProgressPercent,
  orderStatusColor,
} from '@/lib/utils'
import type { OrderStatus } from '@/types'
import LogOutButton from './LogOutButton'
import RecommendedCarousel from './RecommendedCarousel'
import ProfileEditForm from './ProfileEditForm'

export const metadata: Metadata = { title: 'My Account' }

function AccountSettingsList() {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-bold text-gray-900">Account Settings</h2>
      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm">
        <Link
          href="/account/payment-methods"
          className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <CreditCard className="h-4 w-4 text-violet-600" />
          </div>
          <span className="flex-1 text-sm font-medium text-gray-900">Payment Methods</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/account/addresses"
          className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <MapPin className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="flex-1 text-sm font-medium text-gray-900">Addresses</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/account/security"
          className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Shield className="h-4 w-4 text-amber-600" />
          </div>
          <span className="flex-1 text-sm font-medium text-gray-900">Security & Privacy</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <LogOutButton />
      </div>
    </div>
  )
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const [{ orders, total: ordersTotal }, recommended] = await Promise.all([
    getUserOrders(user.id, 1),
    getFeaturedProducts(6),
  ])

  const latestOrder = orders[0] ?? null

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const roleLabel =
    user.role === 'creator' ? 'Creator' : user.role === 'admin' ? 'Admin' : 'Premium Member'

  const stats = [
    { value: ordersTotal, label: 'Orders' },
    { value: 0, label: 'Saved' },
    { value: 0, label: 'Coupons' },
  ]

  return (
    <div className="w-full overflow-x-clip lg:h-[calc(100vh-4rem-1px)] lg:overflow-hidden">
      {/*
        Mobile  (<lg): single column — hero → orders → recommended → settings → edit
        Desktop (lg+): two-column grid — [hero + settings sticky left] | [orders + recommended + edit right]
      */}
      <div className="lg:grid lg:h-[calc(100vh-4rem-1px)] lg:grid-cols-[380px_1fr] lg:gap-8 lg:px-10">
        {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
        <div className="min-w-0 lg:space-y-4 lg:overflow-hidden lg:py-6">
          {/* Profile Hero — mobile: full-bleed / desktop: rounded card */}
          <div className="overflow-hidden bg-gradient-to-b from-violet-600 to-indigo-700 lg:rounded-2xl">
            <div className="px-6 pt-10">
              {/* Avatar */}
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Avatar className="h-15 w-15 ring-4 ring-white/30 ring-offset-2 ring-offset-violet-600">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName ?? 'User'} />
                    <AvatarFallback className="bg-violet-500 text-xl font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 border-violet-600 bg-emerald-400" />
                </div>
              </div>

              {/* Name + subtitle */}
              <div className="mb-5 text-center text-white">
                <h1 className="text-xl leading-tight font-bold">
                  {user.fullName ?? 'Your Account'}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {roleLabel} · Joined {memberSince}
                </p>
              </div>

              {/* Edit / Share buttons */}
              <div className="mb-6 flex gap-3">
                <a
                  href="#edit-profile"
                  className="flex flex-1 items-center justify-center rounded-xl border border-white/30 bg-white/10 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Edit Profile
                </a>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center rounded-xl border border-white/30 bg-white/10 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Share Profile
                </button>
              </div>
            </div>

            {/* Stats strip — -mx-6 + overflow-hidden on parent = full-width within card */}
            <div className="-mx-6 flex border-t border-white/15 bg-white/10">
              {stats.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={cn(
                    'flex flex-1 flex-col items-center py-4',
                    i > 0 && 'border-l border-white/15'
                  )}
                >
                  <span className="text-lg font-bold text-white">{value}</span>
                  <span className="text-xs text-white/65">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings — desktop sidebar only */}
          <div className="hidden lg:block">
            <AccountSettingsList />
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
        <div className="min-w-0 scrollbar-none space-y-5 bg-gray-50 px-4 py-5 pb-14 lg:overflow-y-auto lg:bg-transparent lg:px-0 lg:py-8 lg:pb-8">
          {/* Active Orders */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Active Orders</h2>
              <Link
                href="/account/orders"
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                View All
              </Link>
            </div>

            {latestOrder ? (
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                    <Truck className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 font-mono text-xs text-gray-400">
                      {formatOrderId(latestOrder.id)}
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {latestOrder.items[0]?.product?.name ?? 'Order'}
                      {latestOrder.items.length > 1 && ` +${latestOrder.items.length - 1} more`}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'shrink-0 text-xs capitalize',
                      orderStatusColor(latestOrder.status as OrderStatus)
                    )}
                  >
                    {latestOrder.status}
                  </Badge>
                </div>

                {latestOrder.status !== 'cancelled' && latestOrder.status !== 'refunded' && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-[10px] text-gray-400">
                      <span>{orderProgressLabels(latestOrder.status as OrderStatus)[0]}</span>
                      <span>{orderProgressLabels(latestOrder.status as OrderStatus)[1]}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                        style={{
                          width: `${orderProgressPercent(latestOrder.status as OrderStatus)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href={`/account/orders/${latestOrder.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-violet-300 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                >
                  Track Shipment
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
                <Package className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-900">No active orders</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Start shopping to see your orders here
                </p>
                <Link
                  href="/marketplace"
                  className="mt-4 text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  Browse products
                </Link>
              </div>
            )}
          </section>

          {/* Recommended for You */}
          {recommended.length > 0 && (
            <section>
              <h2 className="mb-3 text-base font-bold text-gray-900">Recommended for You</h2>
              <RecommendedCarousel products={recommended} />
            </section>
          )}

          {/* Account Settings — mobile only (desktop version is in the left sidebar) */}
          <div className="lg:hidden">
            <AccountSettingsList />
          </div>

          {/* Edit Profile — anchor target for hero "Edit Profile" button */}
          <section id="edit-profile" className="scroll-mt-4">
            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
              <ProfileEditForm defaultName={user.fullName ?? ''} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
