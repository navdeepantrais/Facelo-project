import { Video, ShoppingBag, TrendingUp } from 'lucide-react'

const FEATURES = [
  {
    icon: Video,
    title: 'Creator-Recommended Products',
    description: 'Every product is hand-picked and vouched for by verified creators.',
  },
  {
    icon: ShoppingBag,
    title: 'Shop with Confidence',
    description: 'Curated picks, honest reviews, and no filler products.',
  },
  {
    icon: TrendingUp,
    title: 'Instant Creator Commissions',
    description: 'Creators earn automatically on every sale they drive.',
  },
] as const

export function AuthMarketingPanel() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-zinc-950 px-10 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_60%)]"
      />

      <div className="relative flex h-full flex-col">
        <p className="text-xl font-bold tracking-tight">Facelo</p>

        <div className="mt-auto pt-20">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Shop products<br />you can trust.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Discover and buy products recommended by creators you follow.
            Every pick is genuine — no paid placements.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                <Icon className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-1.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-zinc-950 bg-zinc-700"
              />
            ))}
          </div>
          <p className="text-sm text-zinc-400">
            Joined by{' '}
            <span className="font-semibold text-white">10,000+</span> shoppers
          </p>
        </div>
      </div>
    </div>
  )
}
