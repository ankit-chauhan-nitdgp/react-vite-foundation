import { ROUTES } from '@/core/constants/routes'
import type { AppRouteConfig } from '@app/router'

export const appRouteConfig: AppRouteConfig = {
  protectedRoutes: [
    { path: ROUTES.app.dashboard, element: <DashboardPage /> },
  ],
  guestRoutes: [
    { path: ROUTES.auth.login, element: <LoginPage /> },
  ],
}