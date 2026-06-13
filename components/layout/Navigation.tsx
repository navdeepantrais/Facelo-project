'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
]

interface NavigationProps {
  mobile?: boolean
}

export default function Navigation({ mobile }: NavigationProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  if (mobile) {
    return (
      <nav className="flex flex-col gap-1 pt-4">
        <Link href="/" className="mb-4 text-lg font-bold">
          Facelo
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors border-l-2',
              isActive(link.href)
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-0.5">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'relative px-3 py-1.5 text-sm font-medium transition-colors',
            'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-opacity',
            isActive(link.href)
              ? 'text-violet-700 after:bg-violet-600 after:opacity-100'
              : 'text-gray-600 after:opacity-0 hover:text-gray-900'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
