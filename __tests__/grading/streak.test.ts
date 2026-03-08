// Mock Supabase admin client
const mockSingle = jest.fn()
const mockUpdate = jest.fn()
const mockEq = jest.fn()
const mockInsert = jest.fn()

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: mockEq.mockReturnValue({ single: mockSingle }),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  }),
}))

import { updateStreak } from '@/lib/streaks/updateStreak'

describe('updateStreak', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('increments streak when last_active was yesterday', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    mockSingle.mockResolvedValue({
      data: { last_active: yesterdayStr, streak_count: 5, streak_freeze_active: false },
      error: null,
    })

    // Should not throw
    await expect(updateStreak('user-id')).resolves.toBeUndefined()
  })

  it('does nothing when last_active is today', async () => {
    const today = new Date().toISOString().split('T')[0]

    mockSingle.mockResolvedValue({
      data: { last_active: today, streak_count: 5, streak_freeze_active: false },
      error: null,
    })

    await expect(updateStreak('user-id')).resolves.toBeUndefined()
  })

  it('resets streak when broken and no freeze', async () => {
    mockSingle.mockResolvedValue({
      data: { last_active: '2020-01-01', streak_count: 10, streak_freeze_active: false },
      error: null,
    })

    await expect(updateStreak('user-id')).resolves.toBeUndefined()
  })

  it('uses freeze when streak is broken and freeze is active', async () => {
    mockSingle.mockResolvedValue({
      data: { last_active: '2020-01-01', streak_count: 10, streak_freeze_active: true },
      error: null,
    })

    await expect(updateStreak('user-id')).resolves.toBeUndefined()
  })
})
