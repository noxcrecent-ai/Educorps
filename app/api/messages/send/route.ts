import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/messages/send
 * Sends a message from the authenticated user to another user.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { receiver_id, content, file_url } = body

    if (!receiver_id || !content) {
      return NextResponse.json({ error: 'receiver_id and content are required' }, { status: 400 })
    }

    if (typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'content cannot be empty' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id,
        content: content.trim(),
        file_url: file_url || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
