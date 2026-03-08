import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/diagrams
 * Returns diagrams filtered by subject_id and topic_id.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')
    const topic_id = searchParams.get('topic_id')

    const supabase = await createClient()

    let query = supabase.from('diagrams').select('*')

    if (subject_id) query = query.eq('subject_id', subject_id)
    if (topic_id) query = query.eq('topic_id', topic_id)

    const { data, error } = await query.order('title')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ diagrams: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
