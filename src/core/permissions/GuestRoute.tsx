import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../auth/auth-store'
import { ROUTES } from '../constants/routes'

export interface GuestRouteProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export function GuestRoute({
  children,
  redirectTo = ROUTES.app.dashboard,
  fallback = null,
}: GuestRouteProps) {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status === 'idle' || status === 'authenticating') return <>{fallback}</>
  if (status === 'authenticated') {
    const intended =
      (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? redirectTo
    return <Navigate to={intended} replace />
  }

  return <>{children}</>
}
