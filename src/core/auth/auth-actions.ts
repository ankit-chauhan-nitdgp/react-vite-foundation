import { useAuthStore } from './auth-store'
import { tokenManager } from './token-manager'
import { getAuthService } from './auth-service'
import type { LoginPayload } from '../types/auth.types'

export async function login(payload: LoginPayload): Promise<void> {
  const store = useAuthStore.getState()
  store.setStatus('authenticating')
  store.setError(null)
  try {
    const session = await getAuthService().login(payload)
    store.setSession(session)
  } catch (err) {
    store.setStatus('unauthenticated')
    store.setError(err instanceof Error ? err.message : 'Login failed')
    throw err
  }
}

export async function logout(): Promise<void> {
  try {
    await getAuthService().logout()
  } catch {
    // best-effort; we always clear local state
  } finally {
    useAuthStore.getState().clear()
  }
}

export async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string }> {
  const refreshToken = tokenManager.getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')
  const result = await getAuthService().refresh(refreshToken)
  return { accessToken: result.accessToken, refreshToken: result.refreshToken }
}

export async function restoreSession(): Promise<void> {
  const store = useAuthStore.getState()
  store.hydrate()
  if (store.tokens && !store.user) {
    try {
      const user = await getAuthService().me()
      store.setUser(user)
    } catch {
      store.clear()
    }
  }
}
