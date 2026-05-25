import { useCallback, useEffect, useState } from 'react'
import { storage } from '../utils/storage'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => storage.get<T>(key) ?? initialValue)

  useEffect(() => {
    storage.set(key, value)
  }, [key, value])

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next))
    },
    [],
  )

  const remove = useCallback(() => {
    storage.remove(key)
    setValue(initialValue)
  }, [key, initialValue])

  return [value, update, remove]
}
