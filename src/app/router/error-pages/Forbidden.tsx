import { Link } from 'react-router-dom'
import { ROUTES } from '@core/constants/routes'

export function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <h1 className="text-5xl font-bold tracking-tight">403</h1>
      <p className="text-muted-foreground">You don't have permission to view this page.</p>
      <Link
        to={ROUTES.root}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  )
}
