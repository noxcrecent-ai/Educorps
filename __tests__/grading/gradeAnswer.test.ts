// Mock dependencies
jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: jest.fn((table: string) => {
      if (table === 'users') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { groq_api_key: mockEncryptedKey },
                error: null,
              }),
            })),
          })),
        }
      }
      if (table === 'subjects') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { slug: 'maths' },
                error: null,
              }),
            })),
          })),
        }
      }
      if (table === 'user_attempts') {
        return {
          insert: jest.fn().mockResolvedValue({ error: null }),
        }
      }
      return {}
    }),
  }),
}))

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                score: 3,
                max_score: 5,
                method_marks: 1,
                correct: 'Good method shown',
                missing: 'Final units missing',
                improve: 'Always include units',
              }),
            },
          }],
        }),
      },
    },
  }))
})

process.env.GROQ_ENCRYPTION_SECRET = 'ed7f2a9b4c1e8d3f6a0b5c2e9d4f7a1b'

import { encryptKey } from '@/lib/crypto/encryptKey'
const mockEncryptedKey = encryptKey('gsk_test_key_abc123_test_key_abc123_test')

import { gradeAnswer } from '@/lib/grading/gradeAnswer'
import type { Question } from '@/types'

const mockQuestion: Question = {
  id: 'q1',
  topic_id: 't1',
  subject_id: 's1',
  type: 'calculation',
  difficulty: 'medium',
  question_text: 'Calculate the force when mass is 5kg and acceleration is 2m/s²',
  mark_scheme: '1. F = ma | 2. F = 5 × 2 | 3. F = 10N',
  model_answer: 'F = ma = 5 × 2 = 10 N',
  marks_available: 3,
  exam_board: 'AQA',
  year: 2023,
  source_material: null,
  source_material_type: null,
  source_image_url: null,
  created_at: new Date().toISOString(),
}

describe('gradeAnswer', () => {
  it('returns structured feedback with score', async () => {
    const result = await gradeAnswer(mockQuestion, 'F = ma = 10N', 'user-123')

    expect(result).toHaveProperty('score')
    expect(result).toHaveProperty('max_score')
    expect(result).toHaveProperty('correct')
    expect(result).toHaveProperty('missing')
    expect(result).toHaveProperty('improve')
    expect(typeof result.score).toBe('number')
    expect(typeof result.max_score).toBe('number')
  })

  it('returns method_marks for maths/physics questions', async () => {
    const result = await gradeAnswer(mockQuestion, 'F = 10N', 'user-123')
    expect(result).toHaveProperty('method_marks')
  })
})
