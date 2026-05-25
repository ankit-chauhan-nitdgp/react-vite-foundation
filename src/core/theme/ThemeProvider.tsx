import { useEffect, type ReactNode } from 'react'
import { useThemeStore, type ResolvedTheme } from './theme-store'

export interface ThemeProviderProps {
  children: ReactNode
  attribute?: 'class' | 'data-theme'
  /** Element to apply the theme class/attribute to. Default: document.documentElement. */
  root?: HTMLElement | null
}

function resolveSystem(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children, attribute = 'class', root }: ThemeProviderProps) {
  const mode = useThemeStore((s) => s.mode)
  const setResolved = useThemeStore((s) => s.setResolved)

  useEffect(() => {
    const target = root ?? (typeof document !== 'undefined' ? document.documentElement : null)
    if (!target) return

    const apply = (theme: ResolvedTheme) => {
      setResolved(theme)
      if (attribute === 'class') {
        target.classList.toggle('dark', theme === 'dark')
        target.classList.toggle('light', theme === 'light')
      } else {
        target.setAttribute(attribute, theme)
      }
    }

    if (mode !== 'system') {
      apply(mode)
      return
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => apply(resolveSystem())
    apply(resolveSystem())
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [mode, attribute, root, setResolved])

  return <>{children}</>
}
