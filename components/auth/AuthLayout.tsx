import type { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  panel: ReactNode
  children: ReactNode
}

export function AuthLayout({ panel, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:block">{panel}</div>
      <div className="flex min-h-screen flex-col px-6">
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <footer className="text-muted-foreground pb-8 text-center text-xs">
          <span>© 2025 Facelo. All rights reserved.</span>
          <span className="mx-2">·</span>
          <Link
            href="/privacy"
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="hover:text-foreground underline-offset-2 hover:underline">
            Terms of Service
          </Link>
        </footer>
      </div>
    </div>
  )
}
