import { useThemeStore, type ThemeMode, type ResolvedTheme } from './theme-store'

export interface UseThemeResult {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export function useTheme(): UseThemeResult {
  const mode = useThemeStore((s) => s.mode)
  const resolved = useThemeStore((s) => s.resolved)
  const setMode = useThemeStore((s) => s.setMode)

  return {
    mode,
    resolved,
    setMode,
    toggle: () => setMode(resolved === 'dark' ? 'light' : 'dark'),
  }
}
