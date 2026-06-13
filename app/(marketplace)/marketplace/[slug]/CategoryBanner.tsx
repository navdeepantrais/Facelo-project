import { cn } from '@/lib/utils'
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/category-icons'

type Props = {
  name: string
  slug: string
  productCount: number
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  accessories:        'from-violet-100 via-purple-50 to-violet-100',
  'baby-kids':        'from-sky-100 via-blue-50 to-cyan-100',
  'beauty-skincare':  'from-rose-100 via-pink-50 to-rose-100',
  'electronics-tech': 'from-blue-100 via-sky-50 to-indigo-100',
  'fashion-apparel':  'from-fuchsia-100 via-purple-50 to-purple-100',
  'fitness-sports':   'from-emerald-100 via-green-50 to-teal-100',
  'food-nutrition':   'from-amber-100 via-orange-50 to-yellow-100',
  'health-wellness':  'from-cyan-100 via-teal-50 to-cyan-100',
  'home-living':      'from-amber-100 via-yellow-50 to-orange-100',
}

const CATEGORY_ACCENT: Record<string, string> = {
  accessories:        'bg-violet-200 text-violet-700',
  'baby-kids':        'bg-sky-200 text-sky-700',
  'beauty-skincare':  'bg-rose-200 text-rose-700',
  'electronics-tech': 'bg-blue-200 text-blue-700',
  'fashion-apparel':  'bg-fuchsia-200 text-fuchsia-700',
  'fitness-sports':   'bg-emerald-200 text-emerald-700',
  'food-nutrition':   'bg-amber-200 text-amber-700',
  'health-wellness':  'bg-cyan-200 text-cyan-700',
  'home-living':      'bg-yellow-200 text-yellow-800',
}

const CATEGORY_BORDER: Record<string, string> = {
  accessories:        'border-violet-200',
  'baby-kids':        'border-sky-200',
  'beauty-skincare':  'border-rose-200',
  'electronics-tech': 'border-blue-200',
  'fashion-apparel':  'border-fuchsia-200',
  'fitness-sports':   'border-emerald-200',
  'food-nutrition':   'border-amber-200',
  'health-wellness':  'border-cyan-200',
  'home-living':      'border-yellow-200',
}


const CATEGORY_TAGLINES: Record<string, string> = {
  accessories:        'Complete your look with trending creator-picked accessories',
  'baby-kids':        'Safe, fun products loved and tested by parent creators',
  'beauty-skincare':  'Glow up with beauty picks curated by top creators',
  'electronics-tech': 'Cutting-edge gear recommended by tech influencers',
  'fashion-apparel':  'Style finds hand-picked by fashion creators',
  'fitness-sports':   'Train harder with gear trusted by fitness athletes',
  'food-nutrition':   'Fuel your body with creator-approved nutrition picks',
  'health-wellness':  'Live better with expert-recommended wellness products',
  'home-living':      'Transform your space with creator-curated home picks',
}

export function CategoryBanner({ name, slug, productCount }: Props) {
  const gradient = CATEGORY_GRADIENTS[slug] ?? 'from-violet-100 via-indigo-50 to-violet-100'
  const accent   = CATEGORY_ACCENT[slug]    ?? 'bg-violet-200 text-violet-700'
  const border   = CATEGORY_BORDER[slug]    ?? 'border-violet-200'
  const Icon     = CATEGORY_ICONS[slug]     ?? DEFAULT_CATEGORY_ICON
  const tagline  = CATEGORY_TAGLINES[slug]  ?? `Discover the best ${name.toLowerCase()} products`

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br px-7 py-8 shadow-sm sm:px-9 sm:py-10',
        gradient,
        border
      )}
    >
      {/* Ghost icon — subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 select-none opacity-[0.08]"
      >
        <Icon className="h-32 w-32 text-gray-900" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-2.5">
        {/* Icon chip */}
        <div
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-sm',
            accent
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Title + tagline */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {name}
          </h1>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-gray-500">
            {tagline}
          </p>
        </div>

        {/* Product count — only shown when > 0 */}
        {productCount > 0 && (
          <div className="inline-flex w-fit items-center rounded-full border border-white/60 bg-white/60 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-semibold text-gray-700">
              {productCount.toLocaleString()} {productCount === 1 ? 'product' : 'products'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
