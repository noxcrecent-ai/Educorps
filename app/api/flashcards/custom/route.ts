import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/flashcards/custom
 * Creates a custom flashcard for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject_id, topic_id, front_text, back_text } = body

    if (!front_text || !back_text) {
      return NextResponse.json({ error: 'front_text and back_text are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        subject_id: subject_id || null,
        topic_id: topic_id || null,
        front_text,
        back_text,
        is_custom: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ flashcard: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
