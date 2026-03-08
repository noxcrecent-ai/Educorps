import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * PUT /api/settings/subjects
 * Updates the user's subjects and exam_board.
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subjects, exam_board } = body

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({ error: 'At least one subject is required' }, { status: 400 })
    }

    if (!exam_board || typeof exam_board !== 'string') {
      return NextResponse.json({ error: 'exam_board is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ subjects, exam_board })
      .eq('id', user.id)
      .select('id, subjects, exam_board')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
