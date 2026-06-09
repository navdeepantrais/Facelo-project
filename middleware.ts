import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { AdminSubRole, UserRole } from '@/types'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/reset-password', '/auth/verify']
const CREATOR_ROUTES = ['/creator']
const ADMIN_ROUTES = ['/admin']

const ADMIN_SUB_ROLE_ROUTES: Record<string, AdminSubRole[]> = {
  '/admin/products': ['super_admin', 'product_manager'],
  '/admin/creators': ['super_admin', 'creator_manager'],
  '/admin/orders': ['super_admin', 'order_manager'],
  '/admin/videos/moderation': ['super_admin', 'moderator'],
  '/admin/users': ['super_admin', 'moderator'],
  '/admin/attribution': ['super_admin'],
  '/admin/admins': ['super_admin'],
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith('/auth/'))
  const isCreatorRoute = CREATOR_ROUTES.some(r => pathname.startsWith(r))
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))

  if (!user && (isCreatorRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (user && (isCreatorRoute || isAdminRoute)) {
    const { data: profile } = await supabase
      .from('users')
      .select('role, admin_sub_role')
      .eq('id', user.id)
      .single()

    const role = profile?.role as UserRole | undefined
    const subRole = profile?.admin_sub_role as AdminSubRole | undefined

    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isCreatorRoute && role !== 'creator' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isAdminRoute && role === 'admin' && subRole !== 'super_admin') {
      const restrictedRoute = Object.entries(ADMIN_SUB_ROLE_ROUTES).find(([route]) =>
        pathname.startsWith(route)
      )
      if (restrictedRoute) {
        const [, allowedRoles] = restrictedRoute
        if (subRole && !allowedRoles.includes(subRole)) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
