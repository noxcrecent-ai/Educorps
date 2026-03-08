import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/questions/attempts
 * Returns the authenticated user's question attempts with joined question data.
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

    let query = supabase
      .from('user_attempts')
      .select('*, questions(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (subject_id) {
      query = query.eq('questions.subject_id', subject_id)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attempts: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
