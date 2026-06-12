'use client'

import { type ComponentProps, type ReactNode, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  prefixIcon?: ReactNode
}

export function PasswordInput({ className, prefixIcon, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      {prefixIcon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {prefixIcon}
        </div>
      )}
      <Input
        type={visible ? 'text' : 'password'}
        className={cn(prefixIcon ? 'pl-9' : '', 'pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full w-9 cursor-pointer rounded-l-none p-0 hover:bg-transparent"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
