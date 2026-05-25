import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@core/utils/cn'
import type { SelectOption } from '@core/types'

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<SelectProps['size']>, string> = {
  sm: 'h-8 text-sm px-2',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, placeholder, invalid, size = 'md', ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'flex w-full appearance-none rounded-md border bg-background pr-8',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-destructive' : 'border-input',
        sizeClasses[size],
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={String(option.value)} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
})
