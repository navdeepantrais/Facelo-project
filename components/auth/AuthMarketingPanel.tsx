export function AuthMarketingPanel() {
  return (
    <div className="auth-panel relative flex h-full flex-col overflow-hidden text-white">
      {/* Ambient mesh gradient */}
      <div aria-hidden="true" className="auth-panel-overlay pointer-events-none absolute inset-0" />

      {/* Dot grid texture */}
      <div aria-hidden="true" className="auth-panel-dots pointer-events-none absolute inset-0" />

      {/* Left edge accent line */}
      <div
        aria-hidden="true"
        className="auth-panel-left-accent pointer-events-none absolute left-0 top-0 h-full w-[3px]"
      />

      {/* Content */}
      <div className="relative flex h-full flex-col px-12 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/60">
            <span className="text-[13px] font-black leading-none text-white">F</span>
          </div>
          <span className="text-base font-bold tracking-tight">Facelo</span>
        </div>

        {/* Main content — vertically centered */}
        <div className="my-auto max-w-[340px]">
          {/* Headline */}
          <h2 className="text-5xl font-black leading-[1.06] tracking-tight">
            Your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
              audience
            </span>
            <br />
            is waiting.
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-white/55">
            Join thousands of creators earning from digital products,
            memberships, and exclusive content.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex items-center gap-5">
            <div>
              <div className="text-2xl font-black text-white">10K+</div>
              <div className="mt-0.5 text-[11px] text-white/40">Creators</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-white">$2M+</div>
              <div className="mt-0.5 text-[11px] text-white/40">Paid out</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-black text-white">50K+</div>
              <div className="mt-0.5 text-[11px] text-white/40">Customers</div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-start gap-3 border-t border-white/8 pt-6">
          <div className="mt-0.5 flex -space-x-2.5" aria-hidden="true">
            {['bg-violet-300', 'bg-indigo-300', 'bg-purple-400', 'bg-fuchsia-400'].map(
              (bg, i) => (
                <div key={i} className={`h-7 w-7 rounded-full border-2 border-white/10 ${bg}`} />
              )
            )}
          </div>
          <div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-3 w-3 fill-amber-400"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mt-1 text-[12px] text-white/50">
              Trusted by{' '}
              <span className="font-semibold text-white/80">10K+ creators</span> worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
