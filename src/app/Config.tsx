import type { AppRouteConfig } from '@app/router'

export const appRouteConfig: AppRouteConfig = {
  protectedRoutes: [
    { path: '/dashboard', element: <DashboardPage /> },
  ],
  guestRoutes: [
    { path: '/auth/login', element: <LoginPage /> },
  ],
}