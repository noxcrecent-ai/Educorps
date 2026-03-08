import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gradeAnswer } from '@/lib/grading/gradeAnswer'
import { updateStreak } from '@/lib/streaks/updateStreak'

/**
 * POST /api/questions/attempt
 * Submits a question attempt, grades it via Groq, and returns feedback.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question_id, user_answer } = body

    if (!question_id || !user_answer) {
      return NextResponse.json({ error: 'question_id and user_answer are required' }, { status: 400 })
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', question_id)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    try {
      const feedback = await gradeAnswer(question, user_answer, user.id)
      await updateStreak(user.id)
      return NextResponse.json({ feedback })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      if (errMsg === 'no_api_key') {
        return NextResponse.json(
          { error: 'no_api_key', redirect: '/onboarding/api-key' },
          { status: 403 }
        )
      }
      if (errMsg.includes('401')) {
        return NextResponse.json(
          { error: 'invalid_api_key', redirect: '/settings' },
          { status: 403 }
        )
      }
      throw err
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
