import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/questions
 * Returns questions filtered by subject_id, topic_id, difficulty, type, and exam_board.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')
    const topic_id = searchParams.get('topic_id')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')
    const exam_board = searchParams.get('exam_board')

    const supabase = await createClient()

    let query = supabase.from('questions').select('*')

    if (subject_id) query = query.eq('subject_id', subject_id)
    if (topic_id) query = query.eq('topic_id', topic_id)
    if (difficulty) query = query.eq('difficulty', difficulty)
    if (type) query = query.eq('type', type)
    if (exam_board) query = query.eq('exam_board', exam_board)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ questions: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
