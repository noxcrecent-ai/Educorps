import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * PUT /api/marketplace/connect/[id]
 * Allows a teacher to accept or reject a connection request.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'status must be accepted or rejected' }, { status: 400 })
    }

    // Ensure current user is the teacher
    const { data: connectionReq } = await supabase
      .from('connection_requests')
      .select('teacher_id')
      .eq('id', id)
      .single()

    if (!connectionReq || connectionReq.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('connection_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ request: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
