import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/glossary
 * Returns glossary terms filtered by subject_id and optionally by search query.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject_id = searchParams.get('subject_id')
    const search = searchParams.get('search')

    const supabase = await createClient()

    let query = supabase.from('glossary_terms').select('*')

    if (subject_id) query = query.eq('subject_id', subject_id)

    if (search) {
      query = query.or(`term.ilike.%${search}%,definition.ilike.%${search}%`)
    }

    const { data, error } = await query.order('term')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ terms: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
