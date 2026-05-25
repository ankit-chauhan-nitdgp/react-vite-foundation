/**
 * Decouples the api client from the auth store to avoid circular imports.
 * The auth module registers concrete handlers at boot time.
 */
export interface AuthBridge {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  onTokensRefreshed: (accessToken: string, refreshToken?: string) => void
  onUnauthorized: () => void
  refreshTokens: () => Promise<{ accessToken: string; refreshToken?: string }>
}

let bridge: AuthBridge | null = null

export function registerAuthBridge(impl: AuthBridge): void {
  bridge = impl
}

export function getAuthBridge(): AuthBridge | null {
  return bridge
}
