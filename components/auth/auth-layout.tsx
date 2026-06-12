import type { ReactNode } from 'react'

interface AuthLayoutProps {
  hero: ReactNode
  children: ReactNode
  header?: ReactNode
}

export function AuthLayout({ hero, children, header }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--auth-canvas)]">
      {/* Top navigation */}
      <nav className="flex shrink-0 items-center justify-between px-8 py-5 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600">
            <span className="text-[13px] font-black leading-none text-white">F</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">Facelo</span>
        </div>
        {header && <div className="text-sm">{header}</div>}
      </nav>

      {/* Main content — row flex; hero + form side by side on lg */}
      <main className="flex flex-1">
        {/* Left: hero — hidden on mobile, 50% column on desktop */}
        <div className="hidden w-1/2 flex-col border-r border-white/[0.06] lg:flex">{hero}</div>

        {/* Right: form + footer — full width on mobile, 50% on desktop */}
        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </div>
  )
}
