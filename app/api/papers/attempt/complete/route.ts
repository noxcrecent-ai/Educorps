import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/papers/attempt/complete
 * Marks a paper attempt as complete, calculates final scores and returns results.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paper_attempt_id } = body

    if (!paper_attempt_id) {
      return NextResponse.json({ error: 'paper_attempt_id is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: questionAttempts } = await admin
      .from('paper_question_attempts')
      .select('score, max_score')
      .eq('paper_attempt_id', paper_attempt_id)

    const totalScore = questionAttempts?.reduce((sum, a) => sum + (a.score ?? 0), 0) ?? 0
    const maxScore = questionAttempts?.reduce((sum, a) => sum + (a.max_score ?? 0), 0) ?? 0

    const { data, error } = await admin
      .from('paper_attempts')
      .update({
        completed_at: new Date().toISOString(),
        total_score: totalScore,
        max_score: maxScore,
      })
      .eq('id', paper_attempt_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      attempt: data,
      total_score: totalScore,
      max_score: maxScore,
      percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
