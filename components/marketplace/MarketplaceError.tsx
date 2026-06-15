'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

export function MarketplaceError({ error, reset, title = 'Something went wrong' }: Props) {
  useEffect(() => {
    console.error('marketplace.error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 ring-1 ring-orange-100">
        <AlertTriangle className="h-8 w-8 text-orange-400" aria-hidden="true" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        Something went wrong loading this content. This is usually temporary.
      </p>

      {/* Action */}
      <Button
        onClick={reset}
        className="mt-6 cursor-pointer gap-2 bg-violet-600 text-white shadow-sm hover:bg-violet-700"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
