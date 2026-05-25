import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getAuthBridge } from './auth-bridge'
import { normalizeAxiosError } from './normalize-error'
import { logger } from '../utils/logger'

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
  _skipAuth?: boolean
}

let refreshPromise: Promise<{ accessToken: string; refreshToken?: string }> | null = null

export function attachRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const cfg = config as RetriableConfig
    if (cfg._skipAuth) return cfg
    const bridge = getAuthBridge()
    const token = bridge?.getAccessToken()
    if (token) {
      cfg.headers.set('Authorization', `Bearer ${token}`)
    }
    return cfg
  })
}

export function attachResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const cfg = error.config as RetriableConfig | undefined
      const bridge = getAuthBridge()
      const status = error.response?.status

      if (status === 401 && cfg && !cfg._retried && !cfg._skipAuth && bridge) {
        cfg._retried = true
        try {
          refreshPromise ??= bridge.refreshTokens()
          const { accessToken, refreshToken } = await refreshPromise
          bridge.onTokensRefreshed(accessToken, refreshToken)
          cfg.headers.set('Authorization', `Bearer ${accessToken}`)
          return instance.request(cfg)
        } catch (refreshErr) {
          logger.warn('Token refresh failed; logging out', refreshErr)
          bridge.onUnauthorized()
          return Promise.reject(normalizeAxiosError(refreshErr))
        } finally {
          refreshPromise = null
        }
      }

      return Promise.reject(normalizeAxiosError(error))
    },
  )
}
