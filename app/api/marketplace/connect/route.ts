import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/marketplace/connect
 * Creates a connection request from a student to a teacher.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teacher_id, message } = body

    if (!teacher_id) {
      return NextResponse.json({ error: 'teacher_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('connection_requests')
      .insert({
        student_id: user.id,
        teacher_id,
        message: message || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ request: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
