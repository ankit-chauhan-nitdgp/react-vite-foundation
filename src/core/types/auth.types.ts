export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt?: number
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  roles: string[]
  permissions: string[]
  metadata?: Record<string, unknown>
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'unauthenticated'

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}
