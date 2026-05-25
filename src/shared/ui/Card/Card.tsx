import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@core/utils/cn'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
          className,
        )}
        {...rest}
      />
    )
  },
)

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1 p-6 border-b border-border', className)} {...rest} />
    )
  },
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return <h3 ref={ref} className={cn('font-semibold text-foreground', className)} {...rest} />
  },
)

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...rest} />
  },
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('p-6', className)} {...rest} />
  },
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 p-6 pt-0 border-t border-border', className)}
        {...rest}
      />
    )
  },
)
