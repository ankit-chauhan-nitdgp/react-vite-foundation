import { type ReactNode } from 'react'
import { cn } from '@core/utils/cn'

export interface FormFieldProps {
  label?: ReactNode
  htmlFor?: string
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
