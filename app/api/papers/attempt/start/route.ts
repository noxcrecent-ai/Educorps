import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/papers/attempt/start
 * Creates a new paper attempt record and returns the attempt ID.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paper_id, is_timed } = body

    if (!paper_id) {
      return NextResponse.json({ error: 'paper_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('paper_attempts')
      .insert({
        user_id: user.id,
        paper_id,
        is_timed: is_timed ?? false,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attempt_id: data.id, attempt: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
