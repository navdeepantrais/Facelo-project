export default function BrandLoader() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-violet-50">
      {/* Background gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[660px] w-[660px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-400/20 blur-[140px]" />
        <div className="absolute bottom-[8%] left-[5%] h-96 w-96 rounded-full bg-indigo-300/18 blur-[100px]" />
        <div className="absolute top-[30%] right-[6%] h-80 w-80 rounded-full bg-purple-300/15 blur-[90px]" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo tile with pulsing glow halo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 animate-pulse rounded-[28px] bg-gradient-to-br from-violet-500/30 to-indigo-600/30 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl ring-1 shadow-violet-500/50 ring-white/20">
            <span className="text-3xl leading-none font-black text-white">F</span>
          </div>
        </div>

        {/* Brand name + tagline */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[26px] leading-none font-bold tracking-tight text-gray-900">Facelo</p>
          <p className="text-sm font-medium text-violet-600/70">Shop from creators you trust</p>
        </div>

        {/* Sweeping indeterminate progress bar */}
        <div className="relative mt-1 h-[3px] w-44 overflow-hidden rounded-full bg-violet-100">
          <div className="absolute inset-y-0 w-1/2 animate-[loading-sweep_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        </div>
      </div>
    </div>
  )
}
