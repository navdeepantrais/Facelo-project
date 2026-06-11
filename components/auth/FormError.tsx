interface FormErrorProps {
  message?: string
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm" role="alert">
      {message}
    </p>
  )
}
