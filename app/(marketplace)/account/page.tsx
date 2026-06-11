import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BecomeCreatorSection from '@/components/creator/BecomeCreatorSection'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  // Layout guarantees auth; getCurrentUser is cached so this is free
  const user = await getCurrentUser()
  if (!user) return null

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {/* Profile card */}
      <div className="rounded-xl border bg-card p-6 flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName ?? 'User'} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">
              {user.fullName ?? 'No name set'}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Quick links */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="justify-start gap-3 h-auto py-4"
          render={<Link href="/account/orders" />}
        >
          <Package className="h-5 w-5 text-muted-foreground" />
          <div className="text-left">
            <p className="font-medium">My Orders</p>
            <p className="text-xs text-muted-foreground">View your order history</p>
          </div>
        </Button>
      </div>

      {/* Become a Creator — only shown to regular users */}
      {user.role === 'user' && (
        <>
          <Separator className="my-6" />
          <BecomeCreatorSection />
        </>
      )}
    </div>
  )
}
