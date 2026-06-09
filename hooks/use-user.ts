'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUser } from '@/lib/actions/auth'
import type { User } from '@/types'

export function useUser() {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    async function load() {
      const user = await getUser()
      if (mounted) {
        setProfile(user)
        setLoading(false)
      }
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (mounted) setLoading(true)
      load()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { profile, loading }
}
