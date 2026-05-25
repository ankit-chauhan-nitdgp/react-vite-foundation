import type { RouteObject } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { PermissionCheck } from '@core/permissions'

export interface AppRouteConfig {
  /** Public routes (no auth required). Wrapped in PublicLayout by default. */
  publicRoutes?: RouteObject[]
  /** Routes that require the user to be UNAUTHENTICATED (login, register). */
  guestRoutes?: RouteObject[]
  /** Protected app routes. Wrapped in DashboardLayout (or AppShell) by default. */
  protectedRoutes?: RouteObject[]
  /** Extra top-level routes attached outside the standard layouts. */
  extraRoutes?: RouteObject[]
  /** Top-level layout wrappers. Inject your own AppShell here. */
  layouts?: {
    public?: ReactNode
    guest?: ReactNode
    protected?: ReactNode
  }
  /** Default permission check applied to all protected routes (override per-route). */
  defaultPermission?: PermissionCheck
}
