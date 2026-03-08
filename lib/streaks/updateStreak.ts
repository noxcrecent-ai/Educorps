import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Updates the user's study streak.
 * Runs on every question attempt or flashcard session completion.
 * - If last active was yesterday → increment streak
 * - If last active was today → do nothing
 * - If last active was before yesterday:
 *   - If freeze active → deactivate freeze, keep streak
 *   - Else → reset streak to 1
 * Also awards milestone badges at 7, 30, and 100 day streaks.
 *
 * @param userId - The user's ID
 */
export async function updateStreak(userId: string): Promise<void> {
  const admin = createAdminClient()

  const { data: user } = await admin
    .from('users')
    .select('last_active, streak_count, streak_freeze_active')
    .eq('id', userId)
    .single()

  if (!user) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const lastActive = user.last_active
  let streakCount = user.streak_count ?? 0
  let freezeActive = user.streak_freeze_active ?? false

  if (lastActive === todayStr) {
    // Already counted today
    return
  } else if (lastActive === yesterdayStr) {
    // Consecutive day
    streakCount++
  } else {
    // Streak broken
    if (freezeActive) {
      freezeActive = false
    } else {
      streakCount = 1
    }
  }

  await admin
    .from('users')
    .update({
      streak_count: streakCount,
      streak_freeze_active: freezeActive,
      last_active: todayStr,
    })
    .eq('id', userId)

  // Award milestone badges
  const milestones: Record<number, string> = {
    7: 'streak_7',
    30: 'streak_30',
    100: 'streak_100',
  }

  if (milestones[streakCount]) {
    const { data: existing } = await admin
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_slug', milestones[streakCount])
      .single()

    if (!existing) {
      await admin.from('achievements').insert({
        user_id: userId,
        badge_slug: milestones[streakCount],
      })
    }
  }
}
