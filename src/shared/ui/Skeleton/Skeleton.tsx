import type { HTMLAttributes } from 'react'
import { cn } from '@core/utils/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...rest}
    />
  )
}
