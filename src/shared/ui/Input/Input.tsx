import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@core/utils/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  invalid?: boolean
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-8 text-sm px-2',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, leftSlot, rightSlot, size = 'md', ...rest },
  ref,
) {
  if (leftSlot || rightSlot) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border bg-background',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
          invalid ? 'border-destructive' : 'border-input',
          sizeClasses[size],
          className,
        )}
      >
        {leftSlot ? <span className="text-muted-foreground">{leftSlot}</span> : null}
        <input
          ref={ref}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={invalid || undefined}
          {...rest}
        />
        {rightSlot ? <span className="text-muted-foreground">{rightSlot}</span> : null}
      </div>
    )
  }

  return (
    <input
      ref={ref}
      className={cn(
        'flex w-full rounded-md border bg-background',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-destructive' : 'border-input',
        sizeClasses[size],
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  )
})
