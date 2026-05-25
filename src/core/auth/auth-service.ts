import { api } from '../api/client'
import type { AuthSession, LoginPayload, RefreshTokenResponse, AuthUser } from '../types/auth.types'

/**
 * Reusable auth service shape. The default implementation calls a generic
 * REST contract; override `configureAuthService` to point at a different backend
 * without changing any consumer.
 */
export interface AuthServiceContract {
  login: (payload: LoginPayload) => Promise<AuthSession>
  logout: () => Promise<void>
  me: () => Promise<AuthUser>
  refresh: (refreshToken: string) => Promise<RefreshTokenResponse>
}

const defaultEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
  refresh: '/auth/refresh',
}

let endpoints = { ...defaultEndpoints }

export function configureAuthEndpoints(overrides: Partial<typeof defaultEndpoints>): void {
  endpoints = { ...endpoints, ...overrides }
}

export const authService: AuthServiceContract = {
  login: (payload) => api.post<AuthSession, LoginPayload>(endpoints.login, payload, { skipAuth: true }),
  logout: () => api.post<void>(endpoints.logout),
  me: () => api.get<AuthUser>(endpoints.me),
  refresh: (refreshToken) =>
    api.post<RefreshTokenResponse, { refreshToken: string }>(
      endpoints.refresh,
      { refreshToken },
      { skipAuth: true },
    ),
}

let serviceOverride: Partial<AuthServiceContract> = {}

export function configureAuthService(override: Partial<AuthServiceContract>): void {
  serviceOverride = { ...serviceOverride, ...override }
}

export function getAuthService(): AuthServiceContract {
  return { ...authService, ...serviceOverride }
}
