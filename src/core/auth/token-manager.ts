import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants/storage-keys'
import type { AuthTokens } from '../types/auth.types'

const TOKENS_KEY = `${STORAGE_KEYS.auth}::tokens`

export const tokenManager = {
  get(): AuthTokens | null {
    return storage.get<AuthTokens>(TOKENS_KEY)
  },
  set(tokens: AuthTokens): void {
    storage.set(TOKENS_KEY, tokens)
  },
  clear(): void {
    storage.remove(TOKENS_KEY)
  },
  getAccessToken(): string | null {
    return this.get()?.accessToken ?? null
  },
  getRefreshToken(): string | null {
    return this.get()?.refreshToken ?? null
  },
  isExpired(skewSeconds = 30): boolean {
    const tokens = this.get()
    if (!tokens?.expiresAt) return false
    return Date.now() / 1000 >= tokens.expiresAt - skewSeconds
  },
}
