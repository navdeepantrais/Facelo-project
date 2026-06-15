import type { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  panel: ReactNode
  children: ReactNode
  topAction?: ReactNode
}

export function AuthLayout({ panel, children, topAction }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Marketing panel */}
      <div className="hidden lg:block">{panel}</div>

      {/* Form side */}
      <div className="flex min-h-screen flex-col bg-[var(--auth-form-bg)]">
        {/* Thin gradient accent bar */}
        <div className="auth-accent-bar h-[3px] shrink-0" />

        {/* Brand header */}
        <header className="flex items-center justify-between px-8 py-4">
          {/* Logo — hidden on desktop (panel has it), shown on mobile */}
          <div className="flex items-center gap-2 lg:invisible" aria-hidden="true">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
              <span className="text-[11px] leading-none font-black text-white">F</span>
            </div>
            <span className="text-foreground text-sm font-bold">Facelo</span>
          </div>

          {/* Sign up / contextual link */}
          {topAction && <div className="text-sm">{topAction}</div>}
        </header>

        {/* Centered floating form card */}
        <div className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 shadow-black/[0.08] ring-black/[0.05]">
            {children}
          </div>
        </div>

        {/* Footer */}
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
