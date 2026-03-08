import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCard } from '@/lib/flashcards/spacedRep'
import { updateStreak } from '@/lib/streaks/updateStreak'

/**
 * POST /api/flashcards/review
 * Reviews a flashcard with a quality score and updates spaced repetition scheduling.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { flashcard_id, quality } = body

    if (!flashcard_id || quality === undefined) {
      return NextResponse.json({ error: 'flashcard_id and quality are required' }, { status: 400 })
    }

    if (quality !== 0 && quality !== 1) {
      return NextResponse.json({ error: 'quality must be 0 or 1' }, { status: 400 })
    }

    const { data: card, error: cardError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcard_id)
      .single()

    if (cardError || !card) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    const updatedCard = updateCard(card, quality as 0 | 1)

    const { data, error } = await supabase
      .from('flashcards')
      .update({
        ease_factor: updatedCard.ease_factor,
        interval_days: updatedCard.interval_days,
        spaced_rep_due_date: updatedCard.spaced_rep_due_date,
      })
      .eq('id', flashcard_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await updateStreak(user.id)

    return NextResponse.json({ flashcard: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
