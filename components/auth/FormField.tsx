import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import FieldError from '@/components/auth/FieldError'

interface FormFieldProps {
  id: string
  label: string
  errors?: string[]
  action?: ReactNode
  children: ReactNode
}

export function FormField({ id, label, errors, action, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        {action && <div>{action}</div>}
      </div>
      {children}
      <FieldError id={`${id}-error`} errors={errors} />
    </div>
  )
}
