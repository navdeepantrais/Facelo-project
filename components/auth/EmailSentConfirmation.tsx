import Link from 'next/link'

interface EmailSentConfirmationProps {
  title: string
  description: string
}

export default function EmailSentConfirmation({ title, description }: EmailSentConfirmationProps) {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Link
        href="/auth/login"
        className="text-foreground block text-sm font-medium hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  )
}
