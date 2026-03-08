import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { GROQ_VALIDATION_MODEL } from '@/lib/groq/models'

/**
 * POST /api/user/api-key/test
 * Tests a Groq API key by making a minimal real API call.
 * Does NOT store the key — only validates it.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 })
    }

    if (!key.startsWith('gsk_') || key.length < 40) {
      return NextResponse.json({ success: false, error: 'Invalid key format' }, { status: 400 })
    }

    const groq = new Groq({ apiKey: key })

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'hi' }],
      model: GROQ_VALIDATION_MODEL,
      max_tokens: 1,
    })

    if (completion.choices && completion.choices.length > 0) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Key validation failed' }, { status: 400 })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('401') || errMsg.includes('authentication') || errMsg.includes('invalid')) {
      return NextResponse.json({ success: false, error: 'Key validation failed' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Key validation failed' }, { status: 400 })
  }
}
