import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/topics
 * Returns topics for a given subject_id, ordered by order_index.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')

    if (!subject_id) {
      return NextResponse.json({ error: 'subject_id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('subject_id', subject_id)
      .order('order_index')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ topics: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
