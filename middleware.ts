import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/', '/auth/signup', '/auth/login', '/auth/verify']

const PROTECTED_PREFIXES = [
  '/dashboard', '/notes', '/questions', '/papers', '/progress',
  '/tutor', '/flashcards', '/glossary', '/diagrams', '/marketplace',
  '/messages', '/teacher', '/settings', '/onboarding',
]

const ONBOARDING_PATH = '/onboarding/api-key'

/**
 * Middleware that enforces authentication and onboarding flow.
 * - Public routes are accessible without auth.
 * - Protected routes redirect to login if not authenticated.
 * - After auth, incomplete onboarding redirects to /onboarding/api-key.
 * - Completed onboarding on /onboarding/api-key redirects to /dashboard.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_complete && !pathname.startsWith(ONBOARDING_PATH)) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url))
    }

    if (profile && profile.onboarding_complete && pathname.startsWith(ONBOARDING_PATH)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
