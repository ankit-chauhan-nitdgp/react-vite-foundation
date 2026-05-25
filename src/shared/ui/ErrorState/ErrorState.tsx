import type { ReactNode } from 'react'
import { cn } from '@core/utils/cn'
import { Button } from '../Button'

export interface ErrorStateProps {
  title?: ReactNode
  description?: ReactNode
  onRetry?: () => void
  retryLabel?: string
  className?: string
  action?: ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again. If the problem persists, contact support.',
  onRetry,
  retryLabel = 'Retry',
  className,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action ?? (onRetry && <Button onClick={onRetry}>{retryLabel}</Button>)}
    </div>
  )
}
