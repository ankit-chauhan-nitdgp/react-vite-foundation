import { useState, type HTMLAttributes } from 'react'
import { cn } from '@core/utils/cn'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export function Avatar({ src, alt, name, size = 'md', className, ...rest }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const showImage = src && !errored
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground font-medium',
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{name ? initials(name) : '?'}</span>
      )}
    </div>
  )
}
