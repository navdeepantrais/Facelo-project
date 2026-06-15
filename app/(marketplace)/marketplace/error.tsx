'use client'

import { MarketplaceError } from '@/components/marketplace/MarketplaceError'

export default function MarketplacePageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <MarketplaceError error={error} reset={reset} title="Failed to load marketplace" />
    </div>
  )
}
