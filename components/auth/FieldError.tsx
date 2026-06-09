interface FieldErrorProps {
  id: string
  errors?: string[]
}

export default function FieldError({ id, errors }: FieldErrorProps) {
  if (!errors?.[0]) return null
  return (
    <p id={id} className="text-xs text-destructive">
      {errors[0]}
    </p>
  )
}
