import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@core/utils/cn'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const resizeClasses: Record<NonNullable<TextAreaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, invalid, resize = 'vertical', rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'flex w-full rounded-md border bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-destructive' : 'border-input',
        resizeClasses[resize],
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
})
