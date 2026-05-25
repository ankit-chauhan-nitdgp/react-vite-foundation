import { useAuthStore } from './auth-store'
import { login, logout, refreshAccessToken } from './auth-actions'
import type { AuthStatus, AuthUser, LoginPayload } from '../types/auth.types'

export interface UseAuthResult {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<{ accessToken: string; refreshToken?: string }>
}

export function useAuth(): UseAuthResult {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const error = useAuthStore((s) => s.error)

  return {
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'authenticating' || status === 'idle',
    login,
    logout,
    refresh: refreshAccessToken,
  }
}
