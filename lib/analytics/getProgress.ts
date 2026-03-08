import { createAdminClient } from '@/lib/supabase/admin'
import type { ProgressData } from '@/types'

/**
 * Calculates progress analytics for a given user.
 * Fetches all user_attempts joined with question, subject, and topic data.
 * Groups by subject and topic, calculates accuracy, identifies weak topics,
 * and builds a score time-series for frontend charts.
 *
 * @param userId - The user's ID
 * @param subjectId - Optional subject filter
 * @returns Structured progress data for frontend consumption
 */
export async function getProgress(userId: string, subjectId?: string): Promise<ProgressData> {
  const admin = createAdminClient()

  let query = admin
    .from('user_attempts')
    .select(`
      id,
      score,
      max_score,
      created_at,
      questions (
        id,
        subject_id,
        topic_id,
        subjects ( id, slug, name ),
        topics ( id, name )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  const { data: allAttempts } = await query

  // Filter by subjectId in JS after fetching, as Supabase PostgREST does not support
  // filtering on nested relation columns directly.
  const attempts = subjectId
    ? allAttempts?.filter(a => {
        const q = a.questions as unknown as { subject_id: string } | null
        return q?.subject_id === subjectId
      })
    : allAttempts

  if (!attempts || attempts.length === 0) {
    return {
      overall_accuracy: 0,
      total_attempts: 0,
      by_subject: {},
      score_trend: [],
      weak_topics: [],
    }
  }

  let totalScore = 0
  let totalMax = 0
  const bySubject: ProgressData['by_subject'] = {}
  const scoreTrend: ProgressData['score_trend'] = []
  const weakTopics: string[] = []

  for (const attempt of attempts) {
    const score = attempt.score ?? 0
    const maxScore = attempt.max_score ?? 0

    totalScore += score
    totalMax += maxScore

    const question = attempt.questions as unknown as {
      subject_id: string
      topic_id: string
      subjects: { id: string; slug: string; name: string } | null
      topics: { id: string; name: string } | null
    }

    if (!question) continue

    const subjectSlug = question.subjects?.slug || 'unknown'
    const topicName = question.topics?.name || 'Unknown Topic'
    const dateStr = attempt.created_at.split('T')[0]

    scoreTrend.push({ date: dateStr, score, subject: subjectSlug })

    if (!bySubject[subjectSlug]) {
      bySubject[subjectSlug] = { accuracy: 0, attempts: 0, by_topic: {} }
    }

    bySubject[subjectSlug].attempts++

    if (!bySubject[subjectSlug].by_topic[topicName]) {
      bySubject[subjectSlug].by_topic[topicName] = { accuracy: 0, attempts: 0, is_weak: false }
    }

    bySubject[subjectSlug].by_topic[topicName].attempts++
  }

  // Calculate accuracy values
  for (const subjectSlug in bySubject) {
    let subjectScore = 0
    let subjectMax = 0

    for (const attempt of attempts) {
      const question = attempt.questions as unknown as {
        subjects: { slug: string } | null
        topics: { name: string } | null
      }
      if (question?.subjects?.slug !== subjectSlug) continue

      subjectScore += attempt.score ?? 0
      subjectMax += attempt.max_score ?? 0

      const topicName = question?.topics?.name || 'Unknown Topic'
      if (!bySubject[subjectSlug].by_topic[topicName]) continue

      bySubject[subjectSlug].by_topic[topicName].accuracy =
        subjectMax > 0 ? (subjectScore / subjectMax) * 100 : 0
    }

    bySubject[subjectSlug].accuracy = subjectMax > 0 ? (subjectScore / subjectMax) * 100 : 0

    for (const topicName in bySubject[subjectSlug].by_topic) {
      const topic = bySubject[subjectSlug].by_topic[topicName]
      topic.is_weak = topic.accuracy < 60
      if (topic.is_weak && !weakTopics.includes(topicName)) {
        weakTopics.push(topicName)
      }
    }
  }

  return {
    overall_accuracy: totalMax > 0 ? (totalScore / totalMax) * 100 : 0,
    total_attempts: attempts.length,
    by_subject: bySubject,
    score_trend: scoreTrend,
    weak_topics: weakTopics,
  }
}
