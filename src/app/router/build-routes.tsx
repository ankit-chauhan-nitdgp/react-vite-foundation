import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '@core/permissions'
import { AuthLayout } from '@app/layouts/AuthLayout'
import { PublicLayout } from '@app/layouts/PublicLayout'
import { AppShell } from '@app/layouts/AppShell'
import { RootErrorBoundary } from './RootErrorBoundary'
import { NotFound } from './error-pages/NotFound'
import { Forbidden } from './error-pages/Forbidden'
import { ServerError } from './error-pages/ServerError'
import { WelcomePage } from './welcome/WelcomePage'
import { ROUTES } from '@core/constants/routes'
import type { AppRouteConfig } from './types'

/**
 * Build the top-level react-router route tree from a foundation route config.
 * Host products call this once and pass the result to a router (memory/browser/etc).
 *
 * Empty-config behavior: when no routes are registered, the foundation renders
 * a built-in WelcomePage at `/` instead of redirecting to `/dashboard`. This
 * makes a fresh `npm run dev` show something useful out of the box. As soon
 * as any route is registered, the WelcomePage disappears.
 */
export function buildRoutes(config: AppRouteConfig = {}): RouteObject[] {
  const {
    publicRoutes = [],
    guestRoutes = [],
    protectedRoutes = [],
    extraRoutes = [],
    layouts,
    defaultPermission,
  } = config

  const protectedLayout = layouts?.protected ?? <AppShell />
  const publicLayout = layouts?.public ?? <PublicLayout />
  const guestLayout = layouts?.guest ?? <AuthLayout />

  const noRoutesRegistered =
    protectedRoutes.length === 0 &&
    publicRoutes.length === 0 &&
    guestRoutes.length === 0 &&
    extraRoutes.length === 0

  const rootRoute: RouteObject = noRoutesRegistered
    ? { path: ROUTES.root, element: <WelcomePage />, errorElement: <RootErrorBoundary /> }
    : {
        path: ROUTES.root,
        element: <Navigate to={ROUTES.app.dashboard} replace />,
        errorElement: <RootErrorBoundary />,
      }

  return [
    rootRoute,
    {
      element: <ProtectedRoute permission={defaultPermission}>{protectedLayout}</ProtectedRoute>,
      errorElement: <RootErrorBoundary />,
      children: protectedRoutes,
    },
    {
      element: <GuestRoute>{guestLayout}</GuestRoute>,
      errorElement: <RootErrorBoundary />,
      children: guestRoutes,
    },
    {
      element: publicLayout,
      errorElement: <RootErrorBoundary />,
      children: publicRoutes,
    },
    ...extraRoutes,
    {
      path: ROUTES.errors.notFound,
      element: <NotFound />,
    },
    {
      path: ROUTES.errors.forbidden,
      element: <Forbidden />,
    },
    {
      path: ROUTES.errors.serverError,
      element: <ServerError />,
    },
    {
      path: '*',
      element: noRoutesRegistered ? <WelcomePage /> : <NotFound />,
    },
  ]
}
