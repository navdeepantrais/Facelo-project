import type { ReactNode } from 'react'

interface AuthLayoutProps {
  panel: ReactNode
  children: ReactNode
}

export function AuthLayout({ panel, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:block">{panel}</div>
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
