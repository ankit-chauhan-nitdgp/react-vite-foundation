import { ENV } from '@core/constants/env'

/**
 * Default landing page shown when the host product hasn't registered any
 * routes yet. It is replaced automatically as soon as the AppRouteConfig
 * has at least one protected or public route.
 */
export function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {ENV.APP_NAME} · v{ENV.APP_VERSION}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">Foundation is ready.</h1>
            <p className="text-muted-foreground">
              No routes are registered yet. Wire your first route through{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">AppRouteConfig</code> to
              replace this page.
            </p>
          </div>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Add your first route</h2>
            <pre className="overflow-x-auto rounded bg-muted p-4 text-xs leading-relaxed text-foreground">
{`// src/app.config.tsx
import type { AppRouteConfig } from '@app/router'

export const appRouteConfig: AppRouteConfig = {
  protectedRoutes: [
    { path: '/dashboard', element: <DashboardPage /> },
  ],
  guestRoutes: [
    { path: '/auth/login', element: <LoginPage /> },
  ],
}

// src/App.tsx
<AppProviders>
  <AppRouter config={appRouteConfig} />
</AppProviders>`}
            </pre>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <Card title="Authentication" body="useAuth(), ProtectedRoute, GuestRoute, PermissionGate." />
            <Card title="Modals" body='openModal({ type: "confirm", props: { ... } })' />
            <Card title="Toasts" body="notify.success / error / info / promise" />
            <Card title="Uploads" body="UploadManager + useUploads()" />
          </section>

          <p className="text-xs text-muted-foreground">
            See <code className="rounded bg-muted px-1 py-0.5">usecase.md</code> at the project
            root for the full handbook.
          </p>
        </div>
      </div>
    </div>
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{body}</div>
    </div>
  )
}
