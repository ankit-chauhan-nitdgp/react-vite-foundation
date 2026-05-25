import type { ReactNode } from 'react'
import { QueryProvider } from '@core/query'
import { ThemeProvider } from '@core/theme'
import { AuthProvider } from '@core/auth'
import { ToastProvider } from '@core/notifications'
import { ModalProvider } from '@core/modals'

export interface AppProvidersProps {
  children: ReactNode
  /** Skip /me bootstrap (e.g. for tests or public-only shells). */
  skipAuthBootstrap?: boolean
}

/**
 * Composes every cross-cutting provider. Order matters:
 *   ThemeProvider → applies <html> class before children mount
 *   QueryProvider → required by AuthProvider's `/me` bootstrap consumers
 *   AuthProvider  → registers the auth bridge into the api client
 *   ToastProvider → must sit above any code that calls notify()
 *   ModalProvider → must sit above any code that calls openModal()
 */
export function AppProviders({ children, skipAuthBootstrap }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider skipBootstrap={skipAuthBootstrap}>
          <ToastProvider />
          <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
