'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Navigation from './Navigation'
import { CartDrawer } from '@/components/marketplace/CartDrawer'
import { signOut } from '@/lib/actions/auth'
import { useCart } from '@/hooks/use-cart'
import type { User } from '@/types'

interface HeaderProps {
  profile: User | null
}

export default function Header({ profile }: HeaderProps) {
  const [signOutPending, startSignOut] = useTransition()
  const [cartOpen, setCartOpen] = useState(false)
  const { totalItems } = useCart()

  function handleSignOut() {
    startSignOut(async () => {
      await signOut()
    })
  }

  return (
    <>
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <Navigation mobile />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
              <span className="text-[13px] font-black leading-none text-white">F</span>
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight text-gray-900">Facelo</span>
          </Link>

          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" render={<Link href="/search" />}>
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Button>

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="ring-offset-background focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2" />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {profile.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem render={<Link href="/account" />}>My Account</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/orders" />}>
                  My Orders
                </DropdownMenuItem>
                {profile.role === 'creator' && (
                  <DropdownMenuItem render={<Link href="/creator" />}>
                    Creator Dashboard
                  </DropdownMenuItem>
                )}
                {profile.role === 'admin' && (
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={signOutPending}
                  className="text-destructive"
                >
                  {signOutPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/auth/login" />}>
                Sign In
              </Button>
              <Button size="sm" render={<Link href="/auth/register" />}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>

    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
  </>
  )
}
