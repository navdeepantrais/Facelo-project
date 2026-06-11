'use client'

import { Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUrlParams } from '@/hooks/use-url-params'

type Props = {
  className?: string
  placeholder?: string
}

export function SearchBar({ className, placeholder = 'Search products…' }: Props) {
  const { searchParams, setParam } = useUrlParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setParam('q', value.trim())
  }

  function handleClear() {
    setValue('')
    inputRef.current?.focus()
    setParam('q', '')
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label="Search products"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
