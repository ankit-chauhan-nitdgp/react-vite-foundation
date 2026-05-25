import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@core/utils/cn'

const buttonStyles = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-ring',
        ghost: 'bg-transparent text-foreground hover:bg-muted focus-visible:ring-ring',
        danger:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
        success:
          'bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
})
