import { cn } from '@core/utils/cn'

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const sizeClasses = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
} as const

export function Loader({ size = 'md', label = 'Loading', className }: LoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-r-transparent text-muted-foreground',
        sizeClasses[size],
        className,
      )}
    />
  )
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <Loader size="lg" label={label} />
    </div>
  )
}
