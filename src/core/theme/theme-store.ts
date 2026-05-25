import { create } from 'zustand'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants/storage-keys'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  setResolved: (resolved: ResolvedTheme) => void
}

const initialMode: ThemeMode = storage.get<ThemeMode>(STORAGE_KEYS.theme) ?? 'system'

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolved: 'light',
  setMode: (mode) => {
    storage.set(STORAGE_KEYS.theme, mode)
    set({ mode })
  },
  setResolved: (resolved) => set({ resolved }),
}))
