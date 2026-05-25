import { AppProviders } from '@app/providers'
import { AppRouter } from '@app/router'
import { appRouteConfig } from './app/config'

/**
 * Foundation entry point. Host products extend by passing an `AppRouteConfig`
 * (route config) through to `<AppRouter>`. See usecase.md → "Adding New Routes"
 * and "Creating a New Module" for the canonical extension patterns.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter config={appRouteConfig}/>
    </AppProviders>
  )
}
