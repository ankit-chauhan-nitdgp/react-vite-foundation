import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@core/utils/cn'

export interface PublicLayoutProps {
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

export function PublicLayout({ header, footer, children, className }: PublicLayoutProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background text-foreground', className)}>
      {header && <header className="border-b border-border">{header}</header>}
      <main className="flex-1">{children ?? <Outlet />}</main>
      {footer && <footer className="border-t border-border">{footer}</footer>}
    </div>
  )
}
