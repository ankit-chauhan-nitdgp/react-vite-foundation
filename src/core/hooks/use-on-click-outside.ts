import { useEffect, type RefObject } from 'react'

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options: { enabled?: boolean } = {},
): void {
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!ref.current || !target || ref.current.contains(target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
