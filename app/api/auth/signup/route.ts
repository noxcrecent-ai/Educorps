import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/auth/signup
 * Registers a new user with email, password, full_name, subjects, and exam_board.
 * Sends a verification email via Resend.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name, subjects, exam_board } = body

    // Validate inputs
    if (!email || !password || !full_name || !subjects || !exam_board) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({ error: 'At least one subject is required' }, { status: 400 })
    }

    if (typeof exam_board !== 'string' || exam_board.trim() === '') {
      return NextResponse.json({ error: 'Exam board is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Insert user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        subjects,
        exam_board,
        role: 'student',
      })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Send verification email via Resend
    await resend.emails.send({
      from: 'EduCorps <noreply@educorps.app>',
      to: email,
      subject: 'Verify your EduCorps account',
      html: `
        <h1>Welcome to EduCorps, ${full_name}!</h1>
        <p>Please verify your email address to get started.</p>
        <p>Check your inbox for the verification link from Supabase.</p>
      `,
    })

    return NextResponse.json({ success: true, message: 'Please check your email to verify your account' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}
