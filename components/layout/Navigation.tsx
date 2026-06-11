'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
]

interface NavigationProps {
  mobile?: boolean
}

export default function Navigation({ mobile }: NavigationProps) {
  const pathname = usePathname()

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
              'hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(link.href)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors',
            pathname.startsWith(link.href)
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
