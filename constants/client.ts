// Public environment variables — safe to import anywhere (server and client).
// Direct property access is required: Next.js statically replaces process.env.NEXT_PUBLIC_*
// at build time via webpack DefinePlugin. Dynamic access (process.env[name]) is never replaced
// and evaluates to undefined in the browser bundle.

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!_supabaseUrl) {
  throw new Error(
    'Missing required public environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Add it to .env.local and restart the dev server.'
  )
}

const _supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!_supabaseAnonKey) {
  throw new Error(
    'Missing required public environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Add it to .env.local and restart the dev server.'
  )
}

export const SUPABASE_URL: string = _supabaseUrl
export const SUPABASE_ANON_KEY: string = _supabaseAnonKey
export const SITE_URL: string = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
