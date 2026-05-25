import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorState } from '@shared/ui/ErrorState'
import { NotFound } from './error-pages/NotFound'
import { Forbidden } from './error-pages/Forbidden'
import { ServerError } from './error-pages/ServerError'

export function RootErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />
    if (error.status === 403) return <Forbidden />
    if (error.status >= 500) return <ServerError />
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <ErrorState
        title="Unexpected error"
        description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
        onRetry={() => window.location.reload()}
        retryLabel="Reload"
      />
    </div>
  )
}
