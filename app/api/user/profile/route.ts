import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/user/profile
 * Returns the current user's profile. NEVER includes groq_api_key.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, role, subjects, exam_board, grade_level, groq_key_verified, onboarding_complete, streak_count, streak_freeze_active, last_active, created_at')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}

/**
 * PUT /api/user/profile
 * Updates the current user's profile fields.
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, avatar_url, subjects, exam_board, grade_level } = body

    const updates: Record<string, unknown> = {}

    if (full_name !== undefined) {
      if (typeof full_name !== 'string' || full_name.trim() === '') {
        return NextResponse.json({ error: 'Invalid full_name' }, { status: 400 })
      }
      updates.full_name = full_name.trim()
    }

    if (avatar_url !== undefined) {
      if (typeof avatar_url !== 'string') {
        return NextResponse.json({ error: 'Invalid avatar_url' }, { status: 400 })
      }
      updates.avatar_url = avatar_url
    }

    if (subjects !== undefined) {
      if (!Array.isArray(subjects)) {
        return NextResponse.json({ error: 'subjects must be an array' }, { status: 400 })
      }
      updates.subjects = subjects
    }

    if (exam_board !== undefined) {
      if (typeof exam_board !== 'string') {
        return NextResponse.json({ error: 'Invalid exam_board' }, { status: 400 })
      }
      updates.exam_board = exam_board
    }

    if (grade_level !== undefined) {
      if (typeof grade_level !== 'string') {
        return NextResponse.json({ error: 'Invalid grade_level' }, { status: 400 })
      }
      updates.grade_level = grade_level
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, full_name, avatar_url, role, subjects, exam_board, grade_level, groq_key_verified, onboarding_complete, streak_count, last_active')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
