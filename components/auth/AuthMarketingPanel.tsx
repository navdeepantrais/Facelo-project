const STATS = [
  { label: 'PRODUCTS', value: '50K+' },
  { label: 'CREATORS', value: '5K+' },
  { label: 'REVENUE', value: '$2M+' },
] as const

export function AuthMarketingPanel() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-violet-600 to-violet-900 px-10 py-12 text-white">
      {/* subtle radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_60%)]"
      />

      <div className="relative flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90">
            <div className="h-3.5 w-3.5 rounded-sm bg-violet-700" />
          </div>
          <span className="text-lg font-bold tracking-tight">Facelo</span>
        </div>

        {/* Headline */}
        <div className="mt-auto pt-16">
          <h2 className="text-4xl leading-tight font-bold tracking-tight">
            Turn Content Into Revenue
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Join the fastest-growing economy for professional creators. Manage your digital
            storefront, track global sales, and scale your influence with institutional-grade tools.
          </p>
        </div>

        {/* Stats pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {STATS.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
                {label}
              </p>
              <p className="mt-0.5 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2" aria-hidden="true">
            {['bg-violet-300', 'bg-indigo-300', 'bg-purple-300', 'bg-fuchsia-300'].map((bg, i) => (
              <div key={i} className={`h-8 w-8 rounded-full border-2 border-violet-800 ${bg}`} />
            ))}
          </div>
          <p className="text-sm text-white/75">
            Join over <span className="font-semibold text-white">5,000</span> professional creators
            already using Facelo.
          </p>
        </div>
      </div>
    </div>
  )
}
