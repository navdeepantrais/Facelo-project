import { cn } from '@/lib/utils'

type Props = {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarRating({ rating, reviewCount, size = 'md', className }: Props) {
  const clampedRating = Math.min(5, Math.max(0, rating))
  const percentage = (clampedRating / 5) * 100

  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {/* CSS clip overlay for fractional star fill */}
      <div className="relative inline-flex" aria-hidden="true">
        {/* Empty star layer */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={cn(starSize, 'text-muted-foreground/30')} filled />
          ))}
        </div>
        {/* Filled star layer — clipped to the rating percentage */}
        <div
          className="absolute inset-0 flex gap-0.5 overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={cn(starSize, 'text-amber-400')} filled />
          ))}
        </div>
      </div>

      <span className={cn('sr-only')}>Rating: {clampedRating.toFixed(1)} out of 5</span>

      <span className={cn(textSize, 'font-medium tabular-nums text-foreground')}>
        {clampedRating.toFixed(1)}
      </span>

      {reviewCount !== undefined && (
        <span className={cn(textSize, 'text-muted-foreground')}>({reviewCount})</span>
      )}
    </div>
  )
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}
