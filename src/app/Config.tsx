import { lazy } from 'react' 
import type { AppRouteConfig } from '@app/router' 
const SamplePage = lazy(() => import('@modules/dashboard/pages/SamplePage'))
const DashboardPage = lazy(() => import('@modules/dashboard/pages/DashboardPage')) 
const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage'))


export const appRouteConfig: AppRouteConfig = {
  protectedRoutes: [
    { path: '/dashboard', element: <DashboardPage /> },
  ],
  guestRoutes: [
    { path: '/auth/login', element: <LoginPage /> },
     { path: '/sample', element: <SamplePage /> },
  ],
  publicRoutes: [
   
  ],
}