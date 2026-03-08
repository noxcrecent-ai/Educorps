import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProgress } from '@/lib/analytics/getProgress'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/progress/[subject]
 * Returns subject-specific progress analytics.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const { subject } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: subjectData } = await admin
      .from('subjects')
      .select('id')
      .eq('slug', subject)
      .single()

    if (!subjectData) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    const progress = await getProgress(user.id, subjectData.id)
    return NextResponse.json({ progress })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
