import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/marketplace/teachers/[id]
 * Returns a single teacher profile with availability slots.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: teacher, error } = await supabase
      .from('teacher_profiles')
      .select('*, users(id, full_name, avatar_url, email)')
      .eq('id', id)
      .single()

    if (error || !teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const { data: availability } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('teacher_id', id)
      .order('day_of_week')

    return NextResponse.json({ teacher, availability: availability || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
