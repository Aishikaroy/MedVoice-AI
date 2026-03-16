import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run proxy on routes that require auth protection.
     * Explicitly exclude:
     *   - / (homepage — always public)
     *   - /login (auth page — always public)
     *   - /_next/* (Next.js internals)
     *   - /favicon.ico and static media
     */
    '/chatbot/:path*',
    '/api/:path*',
  ],
}
