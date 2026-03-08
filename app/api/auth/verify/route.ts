import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/auth/verify
 * Handles email verification. Exchanges the token for a session.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!token_hash || !type) {
      return NextResponse.json({ error: 'Missing verification parameters' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      await supabase
        .from('users')
        .update({ email: data.user.email })
        .eq('id', data.user.id)
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
