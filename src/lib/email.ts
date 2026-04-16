import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  return resend.emails.send({
    from: from || 'Knowbase <onboarding@resend.dev>',
    to,
    subject,
    html,
  })
}

// Pre-built email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Knowbase!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Welcome to Knowbase, ${name}! 🚀</h1>
        <p style="color: #666; line-height: 1.6;">
          Your AI-powered knowledge base is ready. Start by creating your first space and adding documents.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
           style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
    `,
  }),

  magicLink: (url: string) => ({
    subject: 'Your Knowbase login link',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Login to Knowbase</h1>
        <p style="color: #666; line-height: 1.6;">
          Click the button below to log in to your account. This link expires in 10 minutes.
        </p>
        <a href="${url}"
           style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Log In
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  }),

  documentShared: (documentTitle: string, spaceName: string, sharerName: string) => ({
    subject: `${sharerName} shared a document with you: ${documentTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">📄 ${documentTitle}</h1>
        <p style="color: #666;">
          ${sharerName} shared a document in <strong>${spaceName}</strong> with you.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
           style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
          View Document
        </a>
      </div>
    `,
  }),
}
