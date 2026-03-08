import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/teacher/assignments
 * Returns assignments created by the authenticated teacher.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden: teacher role required' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('assignments')
      .select('*, subjects(name, slug), users!student_id(id, full_name, email)')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ assignments: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}

/**
 * POST /api/teacher/assignments
 * Creates a new assignment for a student.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden: teacher role required' }, { status: 403 })
    }

    const body = await request.json()
    const { student_id, subject_id, title, description, due_date } = body

    if (!student_id || !title || !subject_id) {
      return NextResponse.json({ error: 'student_id, subject_id, and title are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert({
        teacher_id: user.id,
        student_id,
        subject_id,
        title,
        description: description || null,
        due_date: due_date || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ assignment: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
