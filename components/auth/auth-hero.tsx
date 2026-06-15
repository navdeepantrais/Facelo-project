const STATS = [
  { value: '10K+', label: 'active creators' },
  { value: '$2M+', label: 'paid to creators' },
  { value: '50K+', label: 'happy customers' },
] as const

interface AuthHeroProps {
  lines?: string[]
  tagline?: string
}

export function AuthHero({
  lines = ['SIGN', 'IN.'],
  tagline = 'The creator economy platform where passion meets revenue.',
}: AuthHeroProps) {
  const lastLine = lines[lines.length - 1]
  const lastLineBody = lastLine.slice(0, -1)
  const lastLineEnd = lastLine.slice(-1)

  return (
    <div className="flex h-full flex-col justify-between px-10 py-14 lg:px-14">
      {/* Typographic hero + context */}
      <div>
        <h1 className="text-[4.5rem] leading-none font-black tracking-tighter text-white lg:text-[5.5rem] xl:text-[7rem]">
          {lines.slice(0, -1).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">
            {lastLineBody}
            <span className="text-violet-500">{lastLineEnd}</span>
          </span>
        </h1>

        <p className="mt-6 max-w-[280px] text-[15px] leading-relaxed text-white/45">{tagline}</p>

        <dl className="mt-10 space-y-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-3">
              <dt className="text-2xl font-black text-white tabular-nums">{value}</dt>
              <dd className="text-sm text-white/35">{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Testimonial */}
      <blockquote className="border-l-2 border-violet-500/50 pl-4">
        <p className="text-sm leading-relaxed text-white/45 italic">
          &ldquo;Facelo completely changed how I monetize my creative work.&rdquo;
        </p>
        <footer className="mt-2 text-xs text-white/25">
          — Sarah Kim, Design Creator · 1.2K followers
        </footer>
      </blockquote>
    </div>
  )
}
