import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/flashcards
 * Returns flashcards for the user. Can filter by subject_id and due_today.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')
    const due_today = searchParams.get('due_today')

    let query = supabase
      .from('flashcards')
      .select('*')
      .or(`user_id.eq.${user.id},user_id.is.null`)

    if (subject_id) query = query.eq('subject_id', subject_id)

    if (due_today === 'true') {
      const today = new Date().toISOString().split('T')[0]
      query = query.lte('spaced_rep_due_date', today)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ flashcards: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
