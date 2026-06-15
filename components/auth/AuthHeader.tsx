interface AuthHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-[1.75rem] leading-tight font-bold tracking-tight text-transparent">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-gray-500">{subtitle}</p>}
    </div>
  )
}
