import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGroqClient } from '@/lib/groq/getGroqClient'
import { GROQ_GRADING_MODEL } from '@/lib/groq/models'

/**
 * POST /api/tutor/chat
 * Streams an AI tutor response using the user's own Groq key.
 * Requires a valid Groq API key to be set.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groq = await getGroqClient(user.id)
    if (!groq) {
      return NextResponse.json(
        { error: 'no_api_key', redirect: '/onboarding/api-key' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { messages, subject, topic } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
    }

    const subjectStr = subject || 'your subject'
    const examBoard = 'A-Level'

    const systemPrompt = `You are a helpful tutor for ${subjectStr} at ${examBoard} level. Help the student understand concepts clearly. Use simple language, give examples, and break down complex ideas step by step.${topic ? ` Focus on the topic: ${topic}.` : ''}`

    try {
      const stream = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        model: GROQ_GRADING_MODEL,
        stream: true,
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || ''
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            }
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      if (errMsg.includes('401')) {
        return NextResponse.json(
          { error: 'invalid_api_key', redirect: '/settings' },
          { status: 403 }
        )
      }
      throw err
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
