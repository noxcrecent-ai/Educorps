import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gradeAnswer } from '@/lib/grading/gradeAnswer'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGroqClient } from '@/lib/groq/getGroqClient'
import { GROQ_GRADING_MODEL } from '@/lib/groq/models'

/**
 * POST /api/papers/attempt/submit-question
 * Submits and grades a single question within a paper attempt.
 * Supports image-based answers via OCR.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paper_attempt_id, question_id, user_answer, answer_image_url, answer_mode } = body

    if (!paper_attempt_id || !question_id || !answer_mode) {
      return NextResponse.json({ error: 'paper_attempt_id, question_id and answer_mode are required' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: question, error: questionError } = await admin
      .from('questions')
      .select('*')
      .eq('id', question_id)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    let finalAnswer = user_answer

    // OCR image if image-based answer
    if (answer_image_url && answer_mode === 'image') {
      const groq = await getGroqClient(user.id)
      if (!groq) {
        return NextResponse.json({ error: 'no_api_key', redirect: '/onboarding/api-key' }, { status: 403 })
      }
      try {
        const ocrResult = await groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please transcribe the handwritten answer in this image exactly as written.',
                },
                {
                  type: 'image_url',
                  image_url: { url: answer_image_url },
                },
              ],
            },
          ],
          model: GROQ_GRADING_MODEL,
        })
        finalAnswer = ocrResult.choices[0]?.message?.content || user_answer
      } catch {
        finalAnswer = user_answer || ''
      }
    }

    if (!finalAnswer) {
      return NextResponse.json({ error: 'user_answer is required' }, { status: 400 })
    }

    try {
      const feedback = await gradeAnswer(question, finalAnswer, user.id)

      const { data: attemptData, error: attemptError } = await admin
        .from('paper_question_attempts')
        .insert({
          paper_attempt_id,
          question_id,
          user_answer: finalAnswer,
          answer_image_url: answer_image_url || null,
          answer_mode,
          ai_feedback: feedback,
          score: feedback.score,
          max_score: feedback.max_score,
        })
        .select()
        .single()

      if (attemptError) {
        return NextResponse.json({ error: attemptError.message }, { status: 500 })
      }

      return NextResponse.json({ feedback, attempt: attemptData })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      if (errMsg === 'no_api_key') {
        return NextResponse.json({ error: 'no_api_key', redirect: '/onboarding/api-key' }, { status: 403 })
      }
      throw err
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
