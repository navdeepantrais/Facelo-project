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
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-9"
        aria-label="Search products"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
