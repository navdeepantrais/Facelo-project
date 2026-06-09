// Server-only environment variables — NEVER import this file in a client component.
// These are not prefixed with NEXT_PUBLIC_ and are never sent to the browser.
// Node.js resolves process.env dynamically at runtime, so dynamic access would work here,
// but direct access is used for consistency and to satisfy static analysis tools.

const _databaseUrl = process.env.DATABASE_URL
if (!_databaseUrl) {
  throw new Error(
    'Missing required server environment variable: DATABASE_URL\n' +
    'Add it to .env.local (dev) or your deployment environment (prod).',
  )
}

const _serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!_serviceRoleKey) {
  throw new Error(
    'Missing required server environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
    'Add it to .env.local (dev) or your deployment environment (prod).',
  )
}

export const DATABASE_URL: string = _databaseUrl
export const DIRECT_URL: string | undefined = process.env.DIRECT_URL
export const SUPABASE_SERVICE_ROLE_KEY: string = _serviceRoleKey
