import Link from 'next/link'

interface EmailSentConfirmationProps {
  title: string
  description: string
}

export default function EmailSentConfirmation({ title, description }: EmailSentConfirmationProps) {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link
        href="/auth/login"
        className="block text-sm font-medium text-foreground hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  )
}
