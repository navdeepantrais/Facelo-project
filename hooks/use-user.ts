'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUser } from '@/lib/actions/auth'
import type { User } from '@/types'

export function useUser() {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const user = await getUser()
      setProfile(user)
      setLoading(false)
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true)
      load()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { profile, loading }
}
