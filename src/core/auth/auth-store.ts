import { create } from 'zustand'
import type { AuthSession, AuthStatus, AuthTokens, AuthUser } from '../types/auth.types'
import { tokenManager } from './token-manager'
import { sessionManager } from './session-manager'

interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  tokens: AuthTokens | null
  error: string | null
}

interface AuthActions {
  hydrate: () => void
  setSession: (session: AuthSession) => void
  setUser: (user: AuthUser) => void
  setTokens: (tokens: AuthTokens) => void
  updateAccessToken: (accessToken: string, refreshToken?: string) => void
  setStatus: (status: AuthStatus) => void
  setError: (error: string | null) => void
  clear: () => void
}

const initialState: AuthState = {
  status: 'idle',
  user: null,
  tokens: null,
  error: null,
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  hydrate: () => {
    const tokens = tokenManager.get()
    const user = sessionManager.getUser()
    if (tokens && user) {
      set({ tokens, user, status: 'authenticated', error: null })
    } else {
      set({ status: 'unauthenticated' })
    }
  },

  setSession: ({ user, tokens }) => {
    tokenManager.set(tokens)
    sessionManager.setUser(user)
    set({ user, tokens, status: 'authenticated', error: null })
  },

  setUser: (user) => {
    sessionManager.setUser(user)
    set({ user })
  },

  setTokens: (tokens) => {
    tokenManager.set(tokens)
    set({ tokens })
  },

  updateAccessToken: (accessToken, refreshToken) => {
    const prev = get().tokens
    const next: AuthTokens = {
      accessToken,
      refreshToken: refreshToken ?? prev?.refreshToken ?? '',
    }
    tokenManager.set(next)
    set({ tokens: next })
  },

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),

  clear: () => {
    tokenManager.clear()
    sessionManager.clear()
    set({ ...initialState, status: 'unauthenticated' })
  },
}))
