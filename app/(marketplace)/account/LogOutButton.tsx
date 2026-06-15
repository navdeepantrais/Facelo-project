'use client'

import { useTransition } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

export default function LogOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => signOut())}
      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
        ) : (
          <LogOut className="h-4 w-4 text-red-500" />
        )}
      </div>
      <span className="text-sm font-medium text-red-600">Log Out</span>
    </button>
  )
}
