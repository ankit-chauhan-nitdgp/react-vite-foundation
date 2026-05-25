import { Link } from 'react-router-dom'
import { ROUTES } from '@core/constants/routes'

export function ServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <h1 className="text-5xl font-bold tracking-tight">500</h1>
      <p className="text-muted-foreground">Something went wrong on our side.</p>
      <Link
        to={ROUTES.root}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  )
}
