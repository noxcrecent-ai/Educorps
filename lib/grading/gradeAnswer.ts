import { createAdminClient } from '@/lib/supabase/admin'
import { decryptKey } from '@/lib/crypto/encryptKey'
import type { GradingResult, Question } from '@/types'
import Groq from 'groq-sdk'
import { GROQ_GRADING_MODEL } from '@/lib/groq/models'

/**
 * Determines the correct system prompt for the given subject.
 */
function getSystemPrompt(subjectSlug: string, examBoard: string): string {
  const board = examBoard || 'AQA'

  if (['maths', 'physics', 'chemistry'].includes(subjectSlug)) {
    const subject = subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1)
    return `You are a strict but fair ${subject} examiner for ${board}.
Grade the student answer against the mark scheme.
Award method marks for correct working even if the final answer is wrong.
For Physics and Chemistry, check units and significant figures.
Reply ONLY with a valid JSON object. No text outside JSON.
Keys: score, max_score, method_marks, correct, missing, improve.`
  }

  if (subjectSlug === 'cs') {
    return `You are a Computer Science examiner for ${board}.
Evaluate pseudocode, trace tables, or algorithm answers for logical correctness.
Use the exam board's pseudocode conventions. Do not penalise minor syntax issues.
Reply ONLY with a valid JSON object. No text outside JSON.
Keys: score, max_score, logic_errors, output_accuracy, correct, missing, improve.`
  }

  if (subjectSlug === 'economics') {
    return `You are an A-Level Economics examiner for ${board}.
Grade using KAA(E): Knowledge, Application, Analysis, Evaluation.
Check for real-world examples and quality of evaluation for higher mark questions.
Reply ONLY with a valid JSON object. No text outside JSON.
Keys: score, max_score, kaa_breakdown (object with knowledge, application, analysis, evaluation), correct, missing, improve.`
  }

  // Default prompt for other subjects
  return `You are a strict but fair examiner for ${board}.
Grade the student answer against the mark scheme.
Reply ONLY with a valid JSON object. No text outside JSON.
Keys: score, max_score, correct, missing, improve.`
}

/**
 * Grades a student's answer using the user's own Groq API key.
 * Fetches the encrypted key from Supabase using the admin client, decrypts it,
 * calls the Groq API with the appropriate subject prompt, stores and returns feedback.
 *
 * @param question - The question object with mark scheme and subject info
 * @param userAnswer - The student's answer text
 * @param userId - The user's ID to look up their Groq key
 * @returns Structured grading feedback
 */
export async function gradeAnswer(
  question: Question,
  userAnswer: string,
  userId: string
): Promise<GradingResult> {
  const admin = createAdminClient()

  // Fetch encrypted key
  const { data: userData, error: keyError } = await admin
    .from('users')
    .select('groq_api_key')
    .eq('id', userId)
    .single()

  if (keyError || !userData?.groq_api_key) {
    throw new Error('no_api_key')
  }

  const plainKey = decryptKey(userData.groq_api_key)
  const groq = new Groq({ apiKey: plainKey })

  // Get subject slug
  let subjectSlug = 'general'
  if (question.subject_id) {
    const { data: subjectData } = await admin
      .from('subjects')
      .select('slug')
      .eq('id', question.subject_id)
      .single()
    if (subjectData?.slug) subjectSlug = subjectData.slug
  }

  const systemPrompt = getSystemPrompt(subjectSlug, question.exam_board || 'AQA')

  const userPrompt = `Question: ${question.question_text}
Mark Scheme: ${question.mark_scheme || 'Not provided'}
Model Answer: ${question.model_answer || 'Not provided'}
Available Marks: ${question.marks_available || 0}
Student Answer: ${userAnswer}`

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: GROQ_GRADING_MODEL,
    temperature: 0.1,
  })

  const responseText = completion.choices[0]?.message?.content || '{}'

  let feedback: GradingResult
  try {
    feedback = JSON.parse(responseText)
  } catch {
    feedback = {
      score: 0,
      max_score: question.marks_available || 0,
      correct: '',
      missing: 'Unable to parse AI feedback',
      improve: 'Please try again',
    }
  }

  // Store attempt
  await admin.from('user_attempts').insert({
    user_id: userId,
    question_id: question.id,
    user_answer: userAnswer,
    ai_feedback: feedback,
    score: feedback.score,
    max_score: feedback.max_score,
  })

  return feedback
}
