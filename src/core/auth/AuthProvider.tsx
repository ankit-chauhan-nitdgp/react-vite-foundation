import { useEffect, useRef, type ReactNode } from 'react'
import { registerAuthBridge } from '../api/auth-bridge'
import { useAuthStore } from './auth-store'
import { tokenManager } from './token-manager'
import { refreshAccessToken, restoreSession } from './auth-actions'

export interface AuthProviderProps {
  children: ReactNode
  /** Skip calling /me on mount. Default: false. */
  skipBootstrap?: boolean
}

export function AuthProvider({ children, skipBootstrap = false }: AuthProviderProps) {
  const initRef = useRef(false)

  useEffect(() => {
    registerAuthBridge({
      getAccessToken: () => tokenManager.getAccessToken(),
      getRefreshToken: () => tokenManager.getRefreshToken(),
      onTokensRefreshed: (accessToken, refreshToken) => {
        useAuthStore.getState().updateAccessToken(accessToken, refreshToken)
      },
      onUnauthorized: () => {
        useAuthStore.getState().clear()
      },
      refreshTokens: async () => {
        const { accessToken, refreshToken } = await refreshAccessToken()
        return { accessToken, refreshToken }
      },
    })
  }, [])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    if (skipBootstrap) {
      useAuthStore.getState().hydrate()
    } else {
      void restoreSession()
    }
  }, [skipBootstrap])

  return <>{children}</>
}
