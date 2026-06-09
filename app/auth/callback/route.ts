import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upsertUser } from '@/lib/auth-helpers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    if (data.user) {
      await upsertUser(data.user)
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`)
}
