import { useEffect, useRef } from 'react'

type Handler<E extends Event> = (event: E) => void

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: Handler<WindowEventMap[K]>,
  target: Window | Document | HTMLElement | null = typeof window === 'undefined' ? null : window,
): void {
  const savedHandler = useRef(handler)
  savedHandler.current = handler

  useEffect(() => {
    if (!target) return
    const listener = (event: Event) => savedHandler.current(event as WindowEventMap[K])
    target.addEventListener(type, listener)
    return () => target.removeEventListener(type, listener)
  }, [type, target])
}
