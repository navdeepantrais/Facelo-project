import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upsertUser } from '@/lib/auth-helpers'

function sanitizeRedirect(redirectTo: string | null): string {
  if (!redirectTo) return '/'
  // Reject absolute URLs and protocol-relative URLs (//evil.com)
  if (!redirectTo.startsWith('/') || redirectTo.startsWith('//')) return '/'
  return redirectTo
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const safe = sanitizeRedirect(searchParams.get('redirectTo'))

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    if (data.user) {
      await upsertUser(data.user)
    }
  }

  return NextResponse.redirect(`${origin}${safe}`)
}
