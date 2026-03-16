import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Guard: if env vars are missing, pass through without crashing
    if (!supabaseUrl || !supabaseKey) {
      console.warn('[Middleware] Supabase env vars missing — passing through.')
      return supabaseResponse
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        // Middleware must use request.cookies — NOT cookies() from next/headers
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set on the request for the current handler
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Propagate to the outgoing response
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect /chatbot: unauthenticated → redirect to /login
    if (!user && request.nextUrl.pathname.startsWith('/chatbot')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Logged-in users visiting /login → redirect to /chatbot
    if (user && request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/chatbot'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (err) {
    // Safety net: never let middleware crashes bubble up as 404s
    console.error('[Middleware] updateSession error — passing through:', err)
    return NextResponse.next({ request })
  }
}
