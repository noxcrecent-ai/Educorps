import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptKey } from '@/lib/crypto/encryptKey'

/**
 * POST /api/user/api-key/save
 * Encrypts and saves the user's Groq API key.
 * Sets onboarding_complete = true.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    if (!key.startsWith('gsk_') || key.length < 40) {
      return NextResponse.json({ error: 'Invalid key format' }, { status: 400 })
    }

    const encryptedKey = encryptKey(key)

    const { error } = await supabase
      .from('users')
      .update({
        groq_api_key: encryptedKey,
        groq_key_verified: true,
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
