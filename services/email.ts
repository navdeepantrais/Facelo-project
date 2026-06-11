// Transactional email via Resend.
// Install: pnpm add resend
// Add RESEND_API_KEY to .env.local and deployment environment.

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export interface SendEmailResult {
  id: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendEmail(_options: SendEmailOptions): Promise<SendEmailResult> {
  // TODO: wire up Resend
  // const { Resend } = await import('resend')
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // const { data, error } = await resend.emails.send({ from: 'noreply@facelo.com', ..._options })
  // if (error) throw new Error(`Email send failed: ${error.message}`)
  // return { id: data!.id }
  throw new Error('Email service not yet configured. See services/email.ts.')
}
