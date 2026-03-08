import { updateCard } from '@/lib/flashcards/spacedRep'
import type { Flashcard } from '@/types'

const baseCard: Flashcard = {
  id: 'test-id',
  user_id: 'user-id',
  subject_id: null,
  topic_id: null,
  front_text: 'What is Newton\'s first law?',
  back_text: 'An object stays at rest or uniform motion unless acted upon by a force.',
  is_custom: false,
  spaced_rep_due_date: '2024-01-01',
  ease_factor: 2.5,
  interval_days: 1,
}

describe('updateCard (SM-2 spaced repetition)', () => {
  it('correct answer from day 1 → interval 3', () => {
    const updated = updateCard(baseCard, 1)
    expect(updated.interval_days).toBe(3)
    expect(updated.ease_factor).toBeGreaterThan(2.5)
  })

  it('correct answer from day 3 → interval 7', () => {
    const card = { ...baseCard, interval_days: 3 }
    const updated = updateCard(card, 1)
    expect(updated.interval_days).toBe(7)
  })

  it('correct answer from day 7 → interval is rounded(7 * ease_factor)', () => {
    const card = { ...baseCard, interval_days: 7 }
    const updated = updateCard(card, 1)
    expect(updated.interval_days).toBe(Math.round(7 * 2.5))
  })

  it('wrong answer resets interval to 1 and reduces ease_factor', () => {
    const card = { ...baseCard, interval_days: 14, ease_factor: 2.5 }
    const updated = updateCard(card, 0)
    expect(updated.interval_days).toBe(1)
    expect(updated.ease_factor).toBe(2.3)
  })

  it('ease_factor never drops below 1.3', () => {
    const card = { ...baseCard, ease_factor: 1.3 }
    const updated = updateCard(card, 0)
    expect(updated.ease_factor).toBe(1.3)
  })

  it('sets spaced_rep_due_date to a future date', () => {
    const updated = updateCard(baseCard, 1)
    const today = new Date().toISOString().split('T')[0]
    expect(updated.spaced_rep_due_date > today).toBe(true)
  })
})
