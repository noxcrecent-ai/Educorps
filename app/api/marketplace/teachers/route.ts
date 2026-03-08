import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/marketplace/teachers
 * Returns verified teacher profiles with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get('subject')
    const exam_board = searchParams.get('exam_board')
    const teaching_mode = searchParams.get('teaching_mode')

    const supabase = await createClient()

    let query = supabase
      .from('teacher_profiles')
      .select('*, users(id, full_name, avatar_url, email)')
      .eq('is_verified', true)

    if (teaching_mode) query = query.eq('teaching_mode', teaching_mode)

    if (subject) {
      query = query.contains('subjects', [subject])
    }

    if (exam_board) {
      query = query.contains('exam_boards', [exam_board])
    }

    const { data, error } = await query.order('rating_average', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ teachers: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
