import { sendEmail, emailTemplates } from '@/lib/email'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await sendEmail({
      to: user.email,
      ...emailTemplates.welcome(user.email.split('@')[0]),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
