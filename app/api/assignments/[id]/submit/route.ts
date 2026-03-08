import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGroqClient } from '@/lib/groq/getGroqClient'
import { createAdminClient } from '@/lib/supabase/admin'
import { GROQ_GRADING_MODEL } from '@/lib/groq/models'

/**
 * POST /api/assignments/[id]/submit
 * Submits a student assignment and runs AI feedback using the student's Groq key.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, file_url } = body

    if (!content && !file_url) {
      return NextResponse.json({ error: 'content or file_url is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: assignment } = await admin
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single()

    if (!assignment || assignment.student_id !== user.id) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    let aiFeedback = null

    if (content) {
      const groq = await getGroqClient(user.id)
      if (groq) {
        try {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a helpful academic tutor providing constructive feedback on student assignments. Reply ONLY with a valid JSON object with keys: score (0-100), strengths, improvements, overall_comment.',
              },
              {
                role: 'user',
                content: `Assignment: ${assignment.title}\n\nDescription: ${assignment.description || 'Not provided'}\n\nStudent Answer: ${content}`,
              },
            ],
            model: GROQ_GRADING_MODEL,
            temperature: 0.1,
          })
          try {
            aiFeedback = JSON.parse(completion.choices[0]?.message?.content || '{}')
          } catch {
            aiFeedback = { overall_comment: completion.choices[0]?.message?.content }
          }
        } catch {
          // AI feedback optional - continue without it
        }
      }
    }

    const { data, error } = await admin
      .from('assignment_submissions')
      .insert({
        assignment_id: id,
        student_id: user.id,
        content: content || null,
        file_url: file_url || null,
        ai_feedback: aiFeedback,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update assignment status
    await admin
      .from('assignments')
      .update({ status: 'submitted' })
      .eq('id', id)

    return NextResponse.json({ submission: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
