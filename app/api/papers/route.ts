import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/papers
 * Returns past papers filtered by subject_id, exam_board, and year.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')
    const exam_board = searchParams.get('exam_board')
    const year = searchParams.get('year')

    const supabase = await createClient()

    let query = supabase.from('past_papers').select('*')

    if (subject_id) query = query.eq('subject_id', subject_id)
    if (exam_board) query = query.eq('exam_board', exam_board)
    if (year) query = query.eq('year', parseInt(year))

    const { data, error } = await query.order('year', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ papers: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
