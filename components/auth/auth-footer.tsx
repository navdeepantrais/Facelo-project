import Link from 'next/link'

export function AuthFooter() {
  return (
    <footer className="px-8 pt-4 pb-8 text-center text-xs text-white/25 lg:px-14">
      <span>© 2025 Facelo, Inc.</span>
      <span className="mx-2 text-white/10">·</span>
      <Link href="/privacy" className="transition-colors hover:text-white/50">
        Privacy
      </Link>
      <span className="mx-2 text-white/10">·</span>
      <Link href="/terms" className="transition-colors hover:text-white/50">
        Terms
      </Link>
    </footer>
  )
}
