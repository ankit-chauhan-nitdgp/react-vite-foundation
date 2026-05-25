import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@core/utils/cn'

export interface AuthLayoutProps {
  logo?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  className?: string
}

export function AuthLayout({ logo, aside, children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground',
        className,
      )}
    >
      <section className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {logo && <div className="mb-8 flex justify-center">{logo}</div>}
          {children ?? <Outlet />}
        </div>
      </section>
      <aside className="hidden lg:flex items-center justify-center bg-muted/30 border-l border-border">
        {aside}
      </aside>
    </div>
  )
}
