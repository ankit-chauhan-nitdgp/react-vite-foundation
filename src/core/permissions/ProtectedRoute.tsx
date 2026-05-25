import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../auth/auth-store'
import { usePermissions } from './use-permissions'
import { ROUTES } from '../constants/routes'
import type { PermissionCheck, RequireOptions } from './types'

export interface ProtectedRouteProps extends RequireOptions {
  children: ReactNode
  redirectTo?: string
  forbiddenRedirect?: string
  permission?: PermissionCheck
  role?: string | string[]
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  redirectTo = ROUTES.auth.login,
  forbiddenRedirect = ROUTES.errors.forbidden,
  permission,
  role,
  match,
  fallback = null,
}: ProtectedRouteProps) {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()
  const { can, hasRole, hasAnyRole } = usePermissions()

  if (status === 'idle' || status === 'authenticating') return <>{fallback}</>
  if (status !== 'authenticated') {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  let allowed = true
  if (permission !== undefined) allowed = allowed && can(permission, { match })
  if (role !== undefined) {
    allowed = allowed && (Array.isArray(role) ? hasAnyRole(role) : hasRole(role))
  }

  if (!allowed) return <Navigate to={forbiddenRedirect} replace />
  return <>{children}</>
}
