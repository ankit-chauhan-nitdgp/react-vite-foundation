import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { buildRoutes } from './build-routes'
import type { AppRouteConfig } from './types'

export interface AppRouterProps {
  config?: AppRouteConfig
  basename?: string
}

export function AppRouter({ config, basename }: AppRouterProps) {
  const router = useMemo(
    () => createBrowserRouter(buildRoutes(config), { basename }),
    [config, basename],
  )
  return <RouterProvider router={router} />
}
