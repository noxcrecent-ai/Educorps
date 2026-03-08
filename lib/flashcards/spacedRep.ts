import type { Flashcard } from '@/types'

/**
 * Updates a flashcard using the SM-2 spaced repetition algorithm.
 * Quality 1 = correct answer, Quality 0 = incorrect answer.
 * Adjusts ease_factor and interval_days, sets the next due date.
 *
 * @param card - The flashcard to update
 * @param quality - 1 for correct, 0 for incorrect
 * @returns Updated flashcard with new scheduling values
 */
export function updateCard(card: Flashcard, quality: 0 | 1): Flashcard {
  let { ease_factor, interval_days } = card

  if (quality === 1) {
    if (interval_days === 1) interval_days = 3
    else if (interval_days === 3) interval_days = 7
    else interval_days = Math.round(interval_days * ease_factor)
    ease_factor = Math.max(1.3, ease_factor + 0.1)
  } else {
    interval_days = 1
    ease_factor = Math.max(1.3, ease_factor - 0.2)
  }

  const due = new Date()
  due.setDate(due.getDate() + interval_days)

  return {
    ...card,
    ease_factor,
    interval_days,
    spaced_rep_due_date: due.toISOString().split('T')[0],
  }
}
