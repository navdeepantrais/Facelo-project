import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AuthCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className="scrollbar-none relative flex h-dvh flex-col items-center overflow-y-auto bg-[#f8f7ff] px-4">
      {/* Background gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-violet-300/30 blur-[110px]" />
        <div className="absolute bottom-[10%] left-[8%] h-80 w-80 rounded-full bg-indigo-300/25 blur-[90px]" />
        <div className="absolute right-[8%] top-[35%] h-72 w-72 rounded-full bg-purple-300/20 blur-[90px]" />
      </div>

      {/* Logo — centered, above the card */}
      <header className="relative z-10 flex w-full max-w-[440px] justify-center pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40">
            <span className="text-[16px] font-black leading-none text-white">F</span>
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight text-gray-900">Facelo</span>
        </div>
      </header>

      {/* Card — glass morphism */}
      <main className="relative z-10 w-full max-w-[440px] pb-3">
        <div
          className={cn(
            'overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_8px_40px_-4px_rgba(124,58,237,0.18),0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl',
            className
          )}
        >
          {/* Gradient accent bar */}
          <div className="h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

          <div className="px-7 py-6">
            {(title || subtitle) && (
              <div className="mb-5">
                {title && (
                  <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-[1.75rem] font-bold leading-tight tracking-tight text-transparent">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-[440px] pb-4 text-center text-xs text-gray-400">
        <span>© 2025 Facelo, Inc.</span>
        <span className="mx-1.5">·</span>
        <Link href="/privacy" className="transition-colors hover:text-gray-600">
          Privacy
        </Link>
        <span className="mx-1.5">·</span>
        <Link href="/terms" className="transition-colors hover:text-gray-600">
          Terms
        </Link>
      </footer>
    </div>
  )
}
