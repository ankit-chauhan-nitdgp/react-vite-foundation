import { Outlet } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { cn } from '@core/utils/cn'
import { useMediaQuery } from '@core/hooks/use-media-query'

export interface DashboardLayoutProps {
  sidebar: ReactNode
  topbar: ReactNode
  children?: ReactNode
  className?: string
}

export function DashboardLayout({ sidebar, topbar, children, className }: DashboardLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', className)}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Mobile sidebar drawer */}
      {!isDesktop && mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background">
          <div className="flex h-14 items-center gap-2 px-4">
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <MenuIcon />
            </button>
            <div className="min-w-0 flex-1">{topbar}</div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
