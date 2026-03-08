import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/papers/[id]
 * Returns a single paper with all associated questions.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: paper, error: paperError } = await supabase
      .from('past_papers')
      .select('*')
      .eq('id', id)
      .single()

    if (paperError || !paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 })
    }

    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('subject_id', paper.subject_id)

    return NextResponse.json({ paper, questions: questions || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
